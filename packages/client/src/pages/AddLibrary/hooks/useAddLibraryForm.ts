import { useMemo } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  GetPropertiesSuccessReply,
  AddLibrarySuccessResponse,
  AddLibraryErrorResponse,
} from 'server/types';

import { LibraryInfo } from '@services';
import { useServices } from '@hooks';
import { Checkbox, Input, Radio, Textarea } from '@components';
import { HttpRequestError } from 'common/services';

interface ValidationOptions {
  required: boolean;
}

const stringValidation = (options: ValidationOptions) => {
  if (options.required) {
    return z.string().trim().min(1, { message: 'Required' });
  }

  return z.string().trim().or(z.null());
};

const arrayValidation = (options: ValidationOptions) => {
  if (options.required) {
    return z.string().trim().array().nonempty({ message: 'Required' });
  }

  return z.string().trim().array().or(z.null());
};

const typeConfig = {
  text: { Element: Input, validation: stringValidation },
  multiline_text: { Element: Textarea, validation: stringValidation },
  select: { Element: Radio, validation: stringValidation },
  multi_select: { Element: Checkbox, validation: arrayValidation },
};

const getElementByType = (type: keyof typeof typeConfig) => typeConfig[type].Element;

export const useAddLibraryForm = (properties: GetPropertiesSuccessReply['properties']) => {
  const schema = useMemo(() => {
    if (!properties) {
      return z.object({});
    }

    const validationObject = properties.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.name]: typeConfig[curr.type].validation({ required: curr.required }),
      };
    }, {});

    return z.object(validationObject);
  }, [properties]);

  const { handleSubmit, ...formControl } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const { libraryService } = useServices();

  const { mutate: send, isLoading: isSubmitting } = useMutation<
    AddLibrarySuccessResponse,
    HttpRequestError<AddLibraryErrorResponse>,
    LibraryInfo
  >({
    mutationFn: async (library) => {
      const { data } = await libraryService.add(library).response;
      return data as AddLibrarySuccessResponse;
    },
    onError: (error) => {
      const { code, message, responseData } = error;
      const errorMessage = `Code: ${code}\nMessage: ${message}\nServer error message: ${
        responseData!.error
      }`;
      // TODO: убрать `alert`, сделать через UI(notifier или модалка)
      alert(errorMessage);
    },
  });

  const onSubmit = handleSubmit((data) => {
    const validEntries = Object.entries(data).filter(([name, value]) => Boolean(value));
    const dataToSend = Object.fromEntries(validEntries) as LibraryInfo;

    send(dataToSend, { onSuccess: () => formControl.reset() });
  });

  return { getElementByType, formControl: { ...formControl, onSubmit, isSubmitting } };
};
