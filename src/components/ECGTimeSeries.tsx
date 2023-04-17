import { APIResponseData } from '@/pages/api/ecg_timeseries';
import { APIResponseData as APIResponseDataAvg } from '@/pages/api/ecg_average';
import { Line } from 'react-chartjs-2';
// Create a time series chart with ecg.json data
import useSWR from 'swr'
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import { Checkbox, FormControlLabel, TextField, Typography } from '@mui/material';
import { useMemo, useRef, useState } from 'react';
import MonitorHeartIcon from '@mui/icons-material/MonitorHeart';
import OutputIcon from '@mui/icons-material/Output';
import { Chart, ChartData } from 'chart.js';

const ChartA = () => {
  // Randomly select a time series from the ecg.json file
  const [patientId, setPatientId] = useState("0")
  const { data, error, isLoading, isValidating } =
    useSWR<APIResponseData>('/api/ecg_timeseries?' + `id=${patientId}`,
      { refreshInterval: 10000 })

  const { data: dataAvg, error: errorAvg, isLoading: isLoadingAvg, isValidating: isValidatingAvg } =
    useSWR<APIResponseDataAvg>('/api/ecg_average',
      { refreshInterval: 10000 })

  const [checked, setChecked] = useState({
    normal: true,
    abnormal: true,
  });

  const patientsLength = useRef(0)

  if (data) {
    patientsLength.current = data.data.patients
  }

  // donot recalculate it every time its refreshed unless its changed
  const patientList: { id: number, label: string }[] = useMemo(() => {
    const list: { id: number, label: string }[] = []
    for (let i = 0; i < patientsLength.current; i++) {
      list.push({ id: i, label: `Patient${i}` })
    }
    return list
  }, [patientsLength.current])

  const datasets = [] as ChartData<"line", number[], string>['datasets']

  if (data)
    datasets.push({
      label: 'ECG',
      data: Object.values(data.data.timeSeries),
      fill: false,
      backgroundColor: 'rgb(0, 0, 255)',
      borderColor: 'rgb(0, 0, 255)',
    });

  if (dataAvg) {
    if (checked.normal)
      datasets.push({
        label: 'ECG Normal Average',
        data: Object.values(dataAvg.data.normalAvg),
        fill: false,
        backgroundColor: 'rgb(60, 179, 113)',
        borderColor: 'rgb(60, 179, 113)',
      });

    if (checked.abnormal)
      datasets.push({
        label: 'ECG Abnormal Average',
        data: Object.values(dataAvg.data.abnormalAvg),
        fill: false,
        backgroundColor: 'rgb(255, 0, 0)',
        borderColor: 'rgb(255, 0, 0)',
      });
  }


  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {/* <Box>
        isValidating: {isValidating.toString()} <br />
        isLoading: {isLoading.toString()} <br />
      </Box> */}

      {isLoading && <p>Loading...</p>}
      {/* Chartjs Timeseries data */}
      {!error && data && <>
        <h1 className="text-2xl font-bold mb-4">ECG Timeseries</h1>
        {/* Drop down for Patient selection */}
        <Box sx={{
          width: "100%", display: "flex", flexDirection: "row",
          justifyContent: "space-between", alignItems: 'center',
          mb: 2
        }}>
          <Autocomplete
            id="patient-select"
            options={patientList}
            getOptionLabel={(option) => option.label}
            style={{ width: 300 }}
            defaultValue={patientList[data.data.patientId]}
            renderInput={(params) => <TextField {...params} label="Patient Selector" variant="outlined" />}
            onChange={(event, value) => {
              if (value)
                setPatientId(`${value.id}`)
            }}
          />
          <Typography>
            Result <OutputIcon /> : {data.data.label > 0 ? "Abnormal" : "Normal"}
          </Typography>
          <Typography>
            Heart Rate <MonitorHeartIcon /> : {data.data.heartRate} bpm
          </Typography>

          {!errorAvg && <>
            <FormControlLabel
              control={
                <Checkbox
                  checked={checked.abnormal}
                  onChange={(e) => {
                    setChecked({ ...checked, abnormal: e.target.checked })
                  }}
                />}
              label="Abnormal Avg"
              labelPlacement="start"
            />

            <FormControlLabel
              control={<Checkbox
                checked={checked.normal}
                onChange={(e) => {
                  setChecked({ ...checked, normal: e.target.checked })
                }}
              />}
              label="Normal Avg"
              labelPlacement="start"
            />

          </>}

        </Box>

        <Line
          data={{
            labels: Object.keys(data.data.timeSeries),
            datasets,
          }}
          options={{
            scales: {
              y: {
                beginAtZero: false,
              },
            },
          }}
        />
      </>}

    </div>
  )
}

export default ChartA