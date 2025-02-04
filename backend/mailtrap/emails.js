import { mailtrapClient, sender } from "./mailtrap.config.js";
import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
} from "./emailTemplates.js";

export const sendVerificationEmail = async (email, verificationToken) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace(
        "verificationCode",
        verificationToken
      ),
      category: "Email Verification",
    });

    console.log("Email sent sucessfully", response);
  } catch (error) {
    console.error("verification mail error", error);
    throw new Error(`Error sending verification Email ${error}`);
  }
};

export const sendWelcomeEmail = async (email, name) => {
  const recipient = [{ email }];
  try {
    const res = await mailtrapClient.send({
      from: sender,
      to: recipient,
      template_uuid: "432fa1df-7938-40fb-b4c3-ac16d083be0e",
      template_variables: { company_info_name: "Fooderers", name: name },
    });
    console.log("Email sent successfully", res);
  } catch (error) {
    console.error("verification mail error", error);
    throw new Error(`Error sending verification Email ${error}`);
  }
};

export const sendPasswordResetEmail = async (email, resetURL) => {
  const recipient = [{ email }];

  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: " Reset Your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
      category: "Password Reset",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Reset-password mail error", error);
    throw new Error(`Error sending password Reset Email ${error}`);
  }
};

export const sendResetSuccessfullEmail = async (email) => {
  const recipient = [{ email }];
  try {
    const response = await mailtrapClient.send({
      from: sender,
      to: recipient,
      subject: " Password reset Successfull",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
      category: "Passwor  d Reset",
    });
    console.log("Email sent successfully", response);
  } catch (error) {
    console.error("Reset-password-successfull mail error", error);
    throw new Error(`Error sending password successfull Reset Email ${error}`);
  }
};
