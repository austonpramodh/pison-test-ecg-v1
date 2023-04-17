
## Question

Pison explores information which is gathered from biosensor information collected from humans.

Develop a tool to visualize biosensor information. Biosensor data can be from datasets available publicly online (ex. electroencephalogram (EEG), electrocardiogram (ECG or EKG) , Photoplethysmogram (PPG)). 

The tool should be able provide the ability to explore the data in creative ways.

The tool should:

- be responsive for large data sets
- scaleable such that it could handle real-time data streaming
- interactive to allow for data scientist to explore the data


Tools like OPENRNDR provide creative programming frameworks, this is not a requirement to use but an example.


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.
