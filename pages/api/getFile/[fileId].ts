import type {NextApiRequest, NextApiResponse} from 'next'
import db from "../../../db"

type Data = {
    success: boolean;
    fileName?: string;
    fileLocation?: string
    message?: string
}

export default function handler(request: NextApiRequest, response: NextApiResponse<Data>) {
    const {fileId} = request.query;

    try {
        const query = `SELECT file_name, file_location
                       from files
                       WHERE file_id::text = '${fileId}'::text`;
        db.query(query).then((res) =>
            response.status(200).json({
                success: true,
                fileName: res.rows[0]?.file_name,
                fileLocation: res.rows[0]?.file_location
            })
        );
    } catch (err:any) {
        response.status(200).json({success: false, message: err.message});
    }
}


