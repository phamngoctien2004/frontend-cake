export class UserDTO{
    id: number
    name: string
    email: string
    is_active: boolean
    created_at: Date
    updated_at: Date

    constructor(user: any){
        this.id = user.id;
        this.name = user.name;
        this.email = user.email;
        this.is_active = user.is_active;
        this.created_at = user.created_at;
        this.updated_at = user.updated_at;
    }

}