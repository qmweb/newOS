'use client'

import React, { use, useEffect, useState } from 'react'

import { join } from 'path'

import { getResourcePath } from '@janhq/core'

import ChoiceItem from '@/screens/Landing/ModeChoice/ChoiceItem'

const choicesList = [
  [
    'Private Mode',
    'Run the OS on your local computer. This mode is not connected to the Internet, which means all the data is private.',
  ],
  [
    'Online Mode',
    'Data will be stored on a remote server. You still have control over who can access it and you can decide to monetize your data.',
  ],
]

const LandingChoiceScreen = () => {
  const [homePath, setHomePath] = useState<string>("");

  useEffect(() => {
    const fetchResourcePath = async () => {
      const resourcePath = await getResourcePath();
      let homeBuiltPath = join(resourcePath, "..", "renderer");
      homeBuiltPath = join(homeBuiltPath, "index.html");
      setHomePath(`file://${homeBuiltPath}`);
    };

    fetchResourcePath();
  }, [setHomePath]);

  const openApp = (url: string) => {
    window.electronAPI?.loadUrl(url)
  }

  return (
    <main className="relative min-h-screen bg-white">
      <div className="flex h-screen w-screen gap-x-6 p-6">
        <div
          className="block h-full w-full" 
          onClick={() => {
            openApp(homePath)
          }}
        >
          <ChoiceItem name={choicesList[0][0]} text={choicesList[0][1]} />
        </div>
        <div
          className="block h-full w-full"
          onClick={() => {
            openApp('https://os.newcoin.org')
          }}
        >
          <ChoiceItem name={choicesList[1][0]} text={choicesList[1][1]} />
        </div>
      </div>
    </main>
  )
}

export default LandingChoiceScreen
