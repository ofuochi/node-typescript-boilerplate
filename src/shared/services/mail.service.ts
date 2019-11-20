import { Injectable } from "@nestjs/common";

@Injectable()
export class MailService {
	// Use mail-gun
	async sendMail(from: string, to: string, message: string) {}
}
