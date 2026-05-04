import React, { useEffect, useState } from 'react'

interface ClientPreviewProps {
  url: string
}

export const ClientPreview = ({ url }: ClientPreviewProps) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(url)
        const html = await response.text()
        const parser = new DOMParser()
        const doc = parser.parseFromString(html, 'text/html')
        
        // Try to find the Open Graph image first
        const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content')
        // Fall back to Twitter image
        const twitterImage = doc.querySelector('meta[name="twitter:image"]')?.getAttribute('content')
        // Finally fall back to any image
        const anyImage = doc.querySelector('meta[property="og:image:secure_url"]')?.getAttribute('content')
        
        setImageUrl(ogImage || twitterImage || anyImage || null)
      } catch (error) {
        console.error('Error fetching image:', error)
      }
    }

    if (url) {
      fetchImage()
    }
  }, [url])

  if (!imageUrl) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#f0f0f0',
          color: '#666',
          fontSize: '1em',
        }}
      >
        No image
      </div>
    )
  }

  return (
    <img
      src={imageUrl}
      alt="Client preview"
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  )
} 