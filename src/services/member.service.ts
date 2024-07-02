import { IUser } from "../interfaces/user.interface";
import EmailService from "../utils/helpers/email.helper";


export class MemberService{

    private emailService = new EmailService()

    async sendInvitationDao(user: IUser, data: Record<string, string>){

        await this.emailService.sendEmail({
            to: user.email,
            subject: `${user?.fullName} invited you to their project on stack`,
            template: "invitation",
            context: { name: user.fullName,  },
          });
    
    }
} 