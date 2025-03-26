function dateTimeFormat(date) {
  let output = date.toISOString();
  output = output.split("T");
  return output[0];
}

export default dateTimeFormat;