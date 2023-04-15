import { APIResponseData } from '@/pages/api/ecg_timeseries';
import { Line } from 'react-chartjs-2';
// Create a time series chart with ecg.json data
import useSWR from 'swr'
import Box from '@mui/material/Box';
import Autocomplete from '@mui/material/Autocomplete';
import { TextField } from '@mui/material';
import { useMemo, useState } from 'react';


const ChartA = () => {
  // Randomly select a time series from the ecg.json file
  const [patientId, setPatientId] = useState("0")
  const { data, error, isLoading, isValidating } =
    useSWR<APIResponseData>('/api/ecg_timeseries?' + `id=${patientId}`,
      { refreshInterval: 10000 })

  const patientList: { id: number, label: string }[] = useMemo(() => {
    const list: { id: number, label: string }[] = []
    if (data) {
      console.log("Calling useMemo")
      for (let i = 0; i < data.data.patients; i++) {
        list.push({ id: i, label: `Patient${i}` })
      }
    }
    return list
  }, [data?.data.patients])



  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      {isLoading && <p>Loading...</p>}
      {/* Chartjs Timeseries data */}
      {!error && data && <>
        <h1 className="text-2xl font-bold">ECG Timeseries</h1>
        {/* Drop down for Patient selection */}
        <Box sx={{ minWidth: 120 }}>
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
        </Box>

        <Line
          data={{
            labels: Object.keys(data.data.timeSeries),
            datasets: [
              {
                label: 'ECG',
                data: Object.values(data.data.timeSeries),
                fill: false,
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
              },
            ],
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