// https://dev.to/kevin_odongo35/object-oriented-programming-with-typescript-574o
export class Project {
    title: string
    description: string
    videoLink?: string
    repoLink?: string
    hosted?: boolean


    constructor(title: string, description: string, hosted: boolean = false) {
        this.title = title
        this.description = description
        this.hosted = hosted
    }
}