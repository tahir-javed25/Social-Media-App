import DataUriParser from "datauri/parser.js";
import path from "path"

const parser = new DataUriParser();

export const getDataUri = (file)=>{
    const extname = path.extname(file.originalname).toString();
    const dataUri = parser.format(extname, file.buffer).content;

    return dataUri

}

