import { Fragment, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { GetPropertiesSuccessReply } from 'server/types';

import {
  Button,
  Checkbox,
  FieldError,
  Fieldset,
  Form,
  Input,
  InputLabel,
  Radio,
  Textarea,
} from '@components';
import { useDebouncedInput, useLibraryStatus } from '@hooks';

interface Props {
  properties: GetPropertiesSuccessReply['properties'];
}

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

export const LibraryForm = ({ properties }: Props) => {
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

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    mode: 'onSubmit',
    reValidateMode: 'onChange',
    resolver: zodResolver(schema),
  });

  const { setLibrary, existOnDb, existOnNPM } = useLibraryStatus();

  const { value, setValue } = useDebouncedInput({
    onSearch: (value) => {
      setLibrary(value.trim());
    },
    wait: 300,
  });

  const constructInputErrorMessage = (
    libraryName: string,
    validationErrorMessage: string | undefined,
    existOnDb: boolean | null,
    existOnNPM: boolean | null,
  ): string => {
    console.log({ existOnDb, existOnNPM, validationErrorMessage });
    if (existOnDb !== null && existOnDb) {
      return `${libraryName} уже есть в базе`;
    }

    if (validationErrorMessage) {
      return validationErrorMessage;
    }

    if (existOnNPM !== null && !existOnNPM) {
      return `Библиотека ${libraryName} не найдена в NPM`;
    }

    return '';
  };

  const handleLibraryNameChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(event.target.value);
  };

  return (
    <>
      <Form
        onSubmit={handleSubmit((d) => {
          console.log('d', d);
        })}
      >
        {properties.map(({ id, name, required, type, ...property }) => {
          const requiredMark = required ? '*' : '';
          const label = `${property.label}${requiredMark}`.trim();
          const errorMessage = errors[name]?.message as string | undefined;

          if (type === 'text') {
            const inputError = constructInputErrorMessage(
              value.trim(),
              errorMessage,
              existOnDb,
              existOnNPM,
            );
            return (
              <div key={id} className="form-control w-full">
                <InputLabel label={label} />
                <Input {...register(name, { value, onChange: handleLibraryNameChange })} />
                {inputError && <FieldError message={inputError} />}
              </div>
            );
          }

          if (type === 'multiline_text') {
            return (
              <Fragment key={id}>
                <Textarea {...register(name)} label={label} />
                {errorMessage && <FieldError message={errorMessage} />}
              </Fragment>
            );
          }

          return (
            <Fieldset key={id} label={label} errorMessage={errorMessage}>
              {property.value?.map((value) => {
                const { Element } = typeConfig[type];
                return (
                  <Element
                    key={value.id}
                    {...register(name)}
                    value={value.name}
                    label={value.name}
                  />
                );
              })}
            </Fieldset>
          );
        })}
        <Button type="submit">Добавить</Button>
      </Form>
      {import.meta.env.DEV && <DevTool control={control} />}
    </>
  );
};
