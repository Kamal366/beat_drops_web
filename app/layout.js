import './globals.css'

export const metadata = {
  title: 'Beat Drops Music Class | Bhubaneswar Music Academy',
  description: 'Premium, mobile-first admissions and student management experience for Beat Drops Music Class in Bhubaneswar.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{ __html: 'window.addEventListener("error",function(e){if(e.error instanceof DOMException&&e.error.name==="DataCloneError"&&e.message&&e.message.includes("PerformanceServerTiming")){e.stopImmediatePropagation();e.preventDefault()}},true);' }} />
      </head>
      <body>{children}</body>
    </html>
  )
}
