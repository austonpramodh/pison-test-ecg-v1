// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ecg_json from '../../../modeling/ecg.json';
import loadash from 'lodash'
import faker from '@faker-js/faker'

type PatientRow = {
  ["hr"]: number
  // 140 columns of ECG data with "lead<column number>" as the key
  [key: string]: number
}

const df: PatientRow[] = Array.from(ecg_json as PatientRow[])


export type APIResponseData = {
  data: {
    timeSeries: { [key: string]: number }
    heartRate: number;
    patients: number;
    patientId: number;
  }
  message: string
}

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponseData>
) {
  // simulate a slow response
  // await delay(3000);

  // get a patient id from the request
  const patientRowIdx = parseInt(req.query.id as string || "0");

  const heartRate = df[patientRowIdx]["hr"]

  // deep copy the row except for the heart rate column
  const patientRow = loadash.cloneDeep(df[patientRowIdx]) as { [key: string]: number }
  delete patientRow["hr"]

  res.status(200).json({
    data: {
      timeSeries: patientRow,
      heartRate: heartRate,
      patientId: patientRowIdx,
      patients: df.length
    },
    message: "Successfully fetched ECG data"
  })
}
