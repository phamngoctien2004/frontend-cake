export class loginDto{
    email: string;
    name?: string;
    password: string;
    password_confirmation?: string;
    remember: boolean;
    token?: string;
    captcha: string;
    constructor(data: any){
        this.email = data.email;
        this.password = data.password;
        this.password_confirmation = data.password_confirmation;
        this.name = data.name;
        this.remember = data.remember || true;
        this.token = data.token;
        this.captcha = data.captcha || '';
    }
}
