export function vehicleNumberFormat(vehicleNumber: string) {
  if (!vehicleNumber) return "NA";
  let number =
    vehicleNumber?.substring(0, 2) + " " + vehicleNumber?.substring(2, 4) + " ";

  for (let i = 4; i < vehicleNumber.length; i++) {
    if (
      (vehicleNumber.charAt(i) >= "A" && vehicleNumber.charAt(i) <= "Z") ||
      (vehicleNumber.charAt(i) >= "a" && vehicleNumber.charAt(i) <= "z")
    ) {
      number = number + vehicleNumber.charAt(i);
      
    } else {
      number = number + " " + vehicleNumber.substring(i);
      break;
    }
  }

  return number;
}



  
export function phoneNumberFormat(num: any) {

  if (num == null || num==undefined) return "NA";
  
  const numStr = num.toString().replace(/[^\d]/g, '');

  if (numStr.startsWith('1') && numStr.length === 11) {
      // US number format: +1 xxx xxx xxxx
      return `+1 ${numStr.slice(1, 4)} ${numStr.slice(4, 7)} ${numStr.slice(7)}`;
  } else if (numStr.startsWith('91') && numStr.length === 12) {
      // India number format: +91 xxxxx xxxxx
      return `+91 ${numStr.slice(2, 7)} ${numStr.slice(7)}`; // Slicing after skipping +91
  } else if (numStr.startsWith('971') && numStr.length === 12) {
      // UAE number format: +971 xx xxx xxxx
      return `+971 ${numStr.slice(3, 5)} ${numStr.slice(5, 8)} ${numStr.slice(8)}`;
  }else if(numStr.length === 10){
         // Only number and of length 10 -> show it as indian number
       return `+91 ${numStr}`;
  }

  return num;
}


