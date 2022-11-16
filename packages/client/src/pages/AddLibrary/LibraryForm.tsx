import { Fragment } from 'react';
import { DevTool } from '@hookform/devtools';
import { GetPropertiesSuccessReply } from 'server/types';

import {
  Button,
  FieldError,
  Fieldset,
  Form,
  Input,
  InputLabel,
  SearchableFieldset,
  Textarea,
} from '@components';

import { useAddLibraryForm, useLibraryInput } from './hooks';

interface Props {
  properties: GetPropertiesSuccessReply['properties'];
}

const FIELD_SCROLL_THRESHOLD = 6;

export const LibraryForm = ({ properties }: Props) => {
  const {
    getElementByType,
    formControl: {
      control,
      formState: { errors },
      isSubmitting,
      register,
      onSubmit,
    },
  } = useAddLibraryForm(properties);

  const { error, handleChange } = useLibraryInput({
    validationErrorMessage: errors.name?.message as string | undefined,
  });

  return (
    <>
      <Form onSubmit={onSubmit}>
        {properties.map(({ id, name, required, type, ...property }) => {
          const requiredMark = required ? '*' : '';
          const label = `${property.label}${requiredMark}`.trim();
          const errorMessage = errors[name]?.message as string | undefined;

          if (type === 'text') {
            return (
              <div key={id} className="form-control w-full">
                <InputLabel label={label} />
                <Input {...register(name, { onChange: handleChange })} />
                {error && <FieldError message={error} />}
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

          if (property.value?.length! > FIELD_SCROLL_THRESHOLD) {
            return (
              <SearchableFieldset
                key={id}
                label={label}
                errorMessage={errorMessage}
                data={property.value!}
                searchBy="name"
              >
                {(data) =>
                  data.map((item) => {
                    const Element = getElementByType(type);
                    return (
                      <Element
                        key={item.id}
                        {...register(name)}
                        value={item.name}
                        label={item.name}
                      />
                    );
                  })
                }
              </SearchableFieldset>
            );
          }

          return (
            <Fieldset key={id} label={label} errorMessage={errorMessage}>
              {property.value?.map((value) => {
                const Element = getElementByType(type);
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
        <div className="sticky bottom-0 grid">
          <Button type="submit" disabled={isSubmitting} loading={isSubmitting}>
            Добавить
          </Button>
        </div>
      </Form>
      {import.meta.env.DEV && <DevTool control={control} />}
    </>
  );
};
