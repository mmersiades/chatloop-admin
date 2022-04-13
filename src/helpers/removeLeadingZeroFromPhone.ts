type RemoveLeadingZeroFromPhone = ({
  dialCode,
  wholeValue,
}: {
  dialCode: string;
  wholeValue: string;
}) => string;
export const removeLeadingZeroFromPhone: RemoveLeadingZeroFromPhone = ({
  dialCode,
  wholeValue,
}): string => {
  let phoneNumber = wholeValue.split(dialCode)[1];

  if (phoneNumber[0] === '0') {
    phoneNumber = phoneNumber.substring(1);
  }
  console.log('phoneNumber', phoneNumber);
  return dialCode.concat(phoneNumber);
};
