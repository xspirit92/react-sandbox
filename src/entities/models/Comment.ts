export class Comment {
    id: number | undefined;
    email: string | undefined;
    body: string | undefined;

    constructor(id?: number, email?: string, body?: string) {
        this.id = id;
        this.email = email;
        this.body = body;
    }
}