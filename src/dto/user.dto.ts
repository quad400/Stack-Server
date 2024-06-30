import { IsEmail, IsNotEmpty, Matches, MinLength } from "class-validator";

export class RegisterDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  fullName: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*\d|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,}$/, {
    message:
      "Password must be at least 6 characters long, and include uppercase, lowercase, and either a digit or a special character.",
  })
  password: string;
}

export class EmailDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*\d|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,}$/, {
    message:
      "Password must be at least 6 characters long, and include uppercase, lowercase, and either a digit or a special character.",
  })
  password: string;
  }
  
  
  export class ResetPasswordDto{
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*\d|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,}$/, {
    message:
      "Password must be at least 6 characters long, and include uppercase, lowercase, and either a digit or a special character.",
  })
  password: string;

  @IsNotEmpty()
  @MinLength(6)
  @Matches(/^(?=.*\d|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).{6,}$/, {
    message:
      "Password must be at least 6 characters long, and include uppercase, lowercase, and either a digit or a special character.",
  })
  confirmPassword: string;
}