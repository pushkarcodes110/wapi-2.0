import * as Yup from "yup";

export const phoneSchema = Yup.string()
  .matches(/^\d{6,15}$/, "Phone number must be between 6 and 15 digits")
  .required("Phone number is required");

export const languageSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  code: Yup.string().required("Code is required"),
  status: Yup.boolean(),
});

export const getAIModelSchema = (t: (key: string) => string) =>
  Yup.object().shape({
    displayName: Yup.string().required(t("ai_models_validation_display_name_required")),
    provider: Yup.string().required(t("ai_models_validation_provider_required")),
    modelId: Yup.string().required(t("ai_models_validation_model_id_required")),
    apiEndpoint: Yup.string().url(t("ai_models_validation_invalid_url")).optional(),
    description: Yup.string(),
    is_default: Yup.boolean(),
    responsePath: Yup.string().when("provider", {
      is: "custom",
      then: (schema) => schema.required("Response path is required for custom provider"),
      otherwise: (schema) => schema.optional(),
    }),
  });
