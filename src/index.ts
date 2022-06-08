import { initiateExtension } from "./aws_glue_databrew_extension";

export const getPaths = async (region: string): Promise<string[]> => {
  return [""];
};

const extension = initiateExtension(getPaths);

export default extension;
