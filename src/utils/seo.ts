import { useEffect, useState } from 'react'

import { Chapter } from '../api/chapter/chapter'
import { Title } from '../api/titles/title'

export const useTitle = (title: string) => {
  useEffect(() => {
    document.title = title
  }, [title])
}

export const useDescription = (description: string) => {
  useEffect(() => {
    document
      .querySelector('meta[name="description"]')
      ?.setAttribute('content', description)
  }, [description])
}

export const getChapterUrl = (title: Title, chapter: Chapter) => {
  if (!chapter.volume)
    return `/${title.type}/${title.urlName}/${chapter.number
      .toString()
      .replace('.', '_')}`
  else
    return `/${title.type}/${title.urlName}/vol${
      chapter.volume
    }/${chapter.number.toString().replace('.', '_')}`
}

export const getTitleUrl = (title: Title) => {
  if (!title) return ''
  return `/${title.type}/${title.urlName}`
}
