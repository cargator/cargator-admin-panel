export function vehicleNumberFormat(vehicleNumber: string) {
  if (!vehicleNumber) return "";
  let number =
    vehicleNumber?.substring(0, 2) + " " + vehicleNumber?.substring(2, 4) + " ";

  for (let i = 4; i < vehicleNumber.length; i++) {
    if (
      (vehicleNumber.charAt(i) >= "A" && vehicleNumber.charAt(i) <= "Z") ||
      (vehicleNumber.charAt(i) >= "a" && vehicleNumber.charAt(i) <= "z")
    ) {
      number = number + vehicleNumber.charAt(i);
      console.log();
    } else {
      number = number + " " + vehicleNumber.substring(i);
      break;
    }
  }

  return number;
}
