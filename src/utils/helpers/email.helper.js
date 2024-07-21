"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const handlebars_1 = __importDefault(require("handlebars"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../../constants/env");
const response_helper_1 = require("./response.helper");
const status_constants_1 = require("../../constants/status.constants");
class EmailService {
    constructor() {
        this.transporter = nodemailer_1.default.createTransport({
            host: "smtp.gmail.com", // Your SMTP host
            port: 587, // Your SMTP port
            secure: false, // true for 465, false for other ports
            service: "gmail",
            auth: {
                user: `${env_1.EMAIL_NAME}`, // Your SMTP user
                pass: `${env_1.EMAIL_PASS}`, // Your SMTP password
            },
        });
    }
    loadTemplate(templateName, context) {
        const templatePath = path_1.default.join(__dirname, "../templates", `${templateName}.html`);
        const templateSource = fs_1.default.readFileSync(templatePath, "utf-8");
        const template = handlebars_1.default.compile(templateSource);
        return template(context);
    }
    sendEmail(options) {
        return __awaiter(this, void 0, void 0, function* () {
            const html = this.loadTemplate(options.template, options.context);
            const mailOptions = {
                from: `Stack <${env_1.EMAIL_NAME}>`,
                to: options.to,
                subject: options.subject,
                html,
            };
            try {
                yield this.transporter.sendMail(mailOptions);
            }
            catch (error) {
                response_helper_1.ResponseHelper.httpErrorResponse("No internet connection to send mail", status_constants_1.HTTP_STATUS_INTERNAL_SERVER_ERROR);
            }
        });
    }
}
exports.default = EmailService;
