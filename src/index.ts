import express, {Request, Response} from 'express'
import bodyParser from 'body-parser'

const app = express()
const port = process.env.PORT || 3000

const videos = [
    {
        id: 1,
        title: "hello",
        author: "Joe"
    }
]

const parserMiddleware = bodyParser()
app.use(parserMiddleware)

app.get('/videos', (req: Request, res: Response) => {
    res.send(videos)
})
app.post('/videos', (req: Request, res: Response) => {
    const newVideo = {
        id: +(new Date()),
        title: req.body.title,
        author: req.body.author
    }
    res.status(201).send(newVideo)
})
app.get('/videos/:videoId', (req: Request, res: Response) => {
    let video = videos.find(v => v.id === +req.params.videoId)
    video ? res.status(200).send(video) : res.send(404)
})
app.put('/videos/:videoId', (req: Request, res: Response) => {
    let video = videos.find(v => v.id === +req.params.id)
    if (video) {
        video.title = req.body.title
        res.send(video)
    } else {
        res.send(404)
    }
})
app.delete('/videos/:videoId', (req: Request, res: Response) => {
    for (let i = 0; i < videos.length; i++) {
        if (videos[i].id === +req.params.id) {
            videos.splice(i, 1)
            res.send(204)
            return;
        }
    }
    res.send(404)
})
app.delete('/testing/all-data', (req: Request, res: Response) => {
    let result = videos.splice(0, videos.length - 1)
    res.status(204).send(result)
})

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}`)
})