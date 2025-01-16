'use client'
import { useEffect } from 'react'

export default function LoadingDoctors() {
  useEffect(() => {
    async function getLoader() {
      const { cardio } = await import('ldrs')
      cardio.register()  // Ensure the component is registered
    }
    getLoader()
  }, [])

  return <l-cardio size="50" stroke="4" speed="2" color="#1587c8"></l-cardio>
}

