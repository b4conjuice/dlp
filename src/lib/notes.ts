const mongoose = require('mongoose')
const axios = require('axios')
const marked = require('marked')

// const fetcher = (url, options) => fetch(url, options).then((res) => res.text());

const connect = url => {
  const db = mongoose.connection
  mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  mongoose.Promise = global.Promise
  db.on('error', console.error.bind(console, 'MongoDB connection error:'))
}
const NoteSchema = new mongoose.Schema(
  {
    title: String,
    body: String,
    slug: String,
    tags: [String],
    markdown: String,
    list: [String],
    table: [[String]],
    hook: String,
    author: String,
  },
  { timestamps: true }
)

const Note =
  (mongoose.models && mongoose.models.Note) ||
  mongoose.model('Note', NoteSchema)

const getNotes = async ({ id, query }) =>
  id
    ? Note.findById(id).exec()
    : Note.find()
        .sort({ updatedAt: query && query.date === 'asc' ? 1 : -1 })
        .exec()

const saveNote = async ({ id, title, body, slug, tags, hook, author }) => {
  const note = id ? await getNotes({ id }) : new Note()
  if (title) note.title = title
  if (body) note.body = body
  if (slug || slug === '') note.slug = slug
  if (tags || tags === '') note.tags = tags.split(' ')
  if (hook || hook === '') note.hook = hook
  if (author) note.author = author
  const isMarkdown = note.title.startsWith('# ')
  const isList = note.title.startsWith('= ')
  const isCheckList = note.title.startsWith('[ ')
  if (isMarkdown) {
    // const md = await fetcher("https://marked.now.sh", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     text: `${note.title}\n${note.body}`,
    //   }),
    // });
    const md = marked(`${note.title}\n${note.body}`)
    note.markdown = md
  } else {
    note.markdown = null
  }
  if (isList || isCheckList) {
    const list = note.body.split('\n').filter(item => item !== '')
    if (isList) {
      note.list = list
      note.table = list.map(item => item.split('\t'))
    } else {
      note.list = null
      note.table = list.map(i => {
        const [item, checked] = i.split('\t')
        return [item, checked || 'o']
      })
      // .sort(([, b], [, a]) => (b === a ? 0 : b === "x" ? 1 : -1));
    }
  } else {
    note.list = null
    note.table = null
  }
  const savedNote = await note.save()
  return savedNote
}

const deleteNote = async id => Note.remove({ _id: id })

const deployNote = async id => {
  const note = await Note.findById(id).exec()
  if (!note.hook)
    return {
      message: !note
        ? 'note does not exist or does not exist'
        : 'note does not have a hook',
    }
  const response = await axios.post(note.hook)
  return response.data
}

const isEmpty = obj => Object.keys(obj).length === 0

const searchNotes = async query =>
  query && !isEmpty(query)
    ? Note.find(query)
        .sort({ updatedAt: query && query.date === 'asc' ? 1 : -1 })
        .exec()
    : []

module.exports = {
  connect,
  getNotes,
  saveNote,
  deleteNote,
  deployNote,
  searchNotes,
}
