import {
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';

@ValidatorConstraint({ name: 'strongPassword', async: false })
export class StrongPasswordConstraint implements ValidatorConstraintInterface {
  validate(password: string): boolean {
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z@#.*&^!]{8,}$/;
    return passwordRegex.test(password);
  }
}

export function StrongPassword(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'strongPassword',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: StrongPasswordConstraint,
    });
  };
}
