import type, {NextApiRequest, NextApiResponse} from 'next'
import uniqid from "uniqid";
import db from "../../db"

type Data = {
    success: boolean;
    fileName? : string;
    fileLocation? : string
    message? : string
}

export default function handler(request: NextApiRequest, response: NextApiResponse<Data>) {
    const {downloadUrl, fileName} = request.body;

    try {
        const query = `INSERT INTO files(file_name, file_id, file_location) VALUES ('${fileName}','${uniqid()}','${downloadUrl}') returning file_id`;
        db.query(query).then((res) => response.status(200).json({success: true, fileId: res.rows[0]?.file_id}));
    } catch (err: any) {
        response.status(200).json({success: false, message: err.message});
    }
}

export const config = {
    api: {
        bodyParser: true
    },
}