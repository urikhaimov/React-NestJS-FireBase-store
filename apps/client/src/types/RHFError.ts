export type RHFError =
  | import('react-hook-form').FieldError
  | import('react-hook-form').Merge<
      import('react-hook-form').FieldError,
      import('react-hook-form').FieldErrorsImpl<any>
    >
  | undefined;