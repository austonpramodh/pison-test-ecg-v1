// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ecg_json from '../../../modeling/ecg.json';
import loadash from 'lodash'
import faker from '@faker-js/faker'

type PatientRow = {
  hr: number
  label: number
  // 140 columns of ECG data with "lead<column number>" as the key
  [key: string]: number
}

const df: PatientRow[] = Array.from(ecg_json as PatientRow[])


export type APIResponseData = {
  data: {
    normalHR: number
    abnormalHR: number
    abnormalAvg: { [key: string]: number }
    normalAvg: { [key: string]: number }
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

  // Get the average of all the patients who have the same label
  const normalAvgRow: PatientRow = {
    hr: 0,
    label: 0
  }

  const abnormalAvgRow: PatientRow = {
    hr: 0,
    label: 1
  }

  // Initialize the average row
  for (let j = 0; j < 140; j++) {
    normalAvgRow["lead" + j] = 0
    abnormalAvgRow["lead" + j] = 0
  }

  for (let i = 0; i < df.length; i++) {
    const label = df[i].label
    const row = df[i]
    if (label == 0)
      normalAvgRow.hr += row.hr
    else
      abnormalAvgRow.hr += row.hr


    for (let j = 0; j < 140; j++) {
      const key = "lead" + j
      const value = row[key]
      if (label == 0)
        normalAvgRow[key] += value
      else
        abnormalAvgRow[key] += value
    }
  }

  // console.log("normalAvgRow", normalAvgRow)

  for (let j = 0; j < 140; j++) {
    normalAvgRow["lead" + j] /= df.length
    abnormalAvgRow["lead" + j] /= df.length
  }

  normalAvgRow.hr /= df.length
  abnormalAvgRow.hr /= df.length

  const normalHR = normalAvgRow.hr
  const abnormalHR = abnormalAvgRow.hr

  // @ts-ignore
  delete normalAvgRow.hr
  // @ts-ignore
  delete normalAvgRow.label
  // @ts-ignore
  delete abnormalAvgRow.hr
  // @ts-ignore
  delete abnormalAvgRow.label

  res.status(200).json({
    data: {
      abnormalAvg: abnormalAvgRow,
      normalAvg: normalAvgRow,
      normalHR: normalHR,
      abnormalHR: abnormalHR
    },
    message: "Successfully fetched ECG data"
  })
}
