import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 5000

let videos = [
    {
        id: +(new Date().getTime()),
        title: "hello",
        author: "Joe",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date(Date.now() + (3600 * 1000 * 24)).toISOString,
        publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString,
        availableResolutions: ["P144"]
    },
    {
        id: +(new Date().getTime()),
        title: "world",
        author: "Ann",
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date(Date.now() + (3600 * 1000 * 24)).toISOString,
        publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString,
        availableResolutions: ["P144"]
    }
]

const parserMiddleware = bodyParser()
app.use(parserMiddleware)

app.get('/', (req: Request, res: Response) => {
    res.send('Hello world')
})
//
app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})
//
app.post('/videos', (req: Request, res: Response) => {
    let title = req.body.title
    if(!title || typeof title !== 'string' || !title.trim()) {
        res.status(400).send({
            errorMessages: [{
                "message": "Incorrect title",
                "field": "title"
            }],
            resultCode: 1
        })
        return;
    }
    const newVideo = {
        id: +(new Date()),
        title: title,
        author: req.body.author,  // 'it-incubator.eu'
        canBeDownloaded: true,
        minAgeRestriction: null,
        createdAt: new Date(Date.now() + (3600 * 1000 * 24)).toISOString,
        publicationDate: new Date(Date.now() + (3600 * 1000 * 24)).toISOString,
        availableResolutions: ["P144"]
    }
    videos.push(newVideo)
    res.status(201).send(newVideo)
})
app.get('/videos/:videoId', (req: Request, res: Response) => {
    let video = videos.find(v => v.id === +req.params.videoId)
    video ? res.status(200).send(video) : res.send(404)
})
//
app.put('/videos/:videoId', (req: Request, res: Response) => {
    let title = req.body.title
    if(!title || typeof title !== 'string' || !title.trim()) {
        res.status(400).send({
            errorMessages: [{
                "message": "Incorrect title",
                "field": "title"
            }],
            resultCode: 1
        })
        return;
    }

    const id = +req.params.videoId;
    const video = videos.find(v => v.id === id)
    if (video) {
        video.title = req.body.title
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
    res.status(204).send(result)
})

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})