const now = +(new Date());
let index = 0;

export default function uid() {
  return `syl-img-upload-${now}-${++index}`;
}