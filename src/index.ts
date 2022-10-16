import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 5000

let videos = [
    {
        id: +(new Date().getTime()),
        title: "hello",
        author: "Author A",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
        publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
        availableResolutions: ["P144"]
    },
    {
        id: +(new Date().getTime()),
        title: "world",
        author: "Author B",
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
        publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
        availableResolutions: ["P144"]
    }
]

const parserMiddleware = bodyParser()
app.use(parserMiddleware)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
})
app.get('/videos', (req: Request, res: Response) => {
    res.status(200).send(videos)
})
app.post('/videos', (req: Request, res: Response) => {
    let title = req.body.title
    if(!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        res.status(400).send({
            errorMessages: [{
                "message": "Incorrect title",
                "field": "title"
            }]
        })
        return;
    }

    let author = req.body.author
    if(!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        res.status(400).send({
            errorMessages: [{
                "message": "Incorrect author",
                "field": "author"
            }]
        })
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: title,
        author: author,
        canBeDownloaded: false,
        minAgeRestriction: null,
        createdAt: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
        publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString(),
        availableResolutions: ["P144"]
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})
app.get('/videos/:videoId', (req: Request, res: Response) => {
    let video = videos.find(v => v.id === +req.params.videoId)
    if (!video) {
        res.send(404)
    } else {
        res.status(200).send(video)
    }
})
app.put('/videos/:videoId', (req: Request, res: Response) => {
    let title = req.body.title
    if(!title || typeof title !== 'string' || !title.trim() || title.length > 40) {
        res.status(400).send({
            errorMessages: [{
                "message": "Incorrect title",
                "field": "title"
            }, {
                message: "message",
                field: "canBeDownloaded"
            }]
        })
        return;
    }

    let author = req.body.author
    if(!author || typeof author !== 'string' || !author.trim() || author.length > 20) {
        res.status(400).send({
            errorMessages: [{
                "message": "Incorrect author",
                "field": "author"
            }]
        })
        return;
    }

    const id = +req.params.videoId
    let video = videos.find(v => v.id === id)
    if (video) {
        video.title = req.body.title
        video.author = req.body.author
        video.canBeDownloaded = req.body.canBeDownloaded
        video.minAgeRestriction = req.body.minAgeRestriction
        video.publicationDate = req.body.publicationDate
        video.availableResolutions = req.body.availableResolutions
        res.status(204).send(video)
    } else {
        res.send(404)
    }
})
app.delete('/videos/:videoId', (req: Request, res: Response) => {
    const id = +req.params.videoId
    const newVideos = videos.filter(v => v.id !== id)
    if (newVideos.length < videos.length) {
        videos = newVideos
        res.send(204)
    } else {
        res.send(404)
    }
})
app.delete('/testing/all-data', (req: Request, res: Response) => {
    let result = videos.splice(0, videos.length - 1)
    if (result) {
        res.status(204).send(result)
    } else {
        res.status(404)
    }

})

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})