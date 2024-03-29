export class TemplateDefault {
  static readonly CLINIC_NAME_VAR = '@CLINIC_NAME';
  static readonly BOOKING_DETAILS_VAR = '@BOOKING_DETAILS';
  static readonly SERVICES_VAR = '@SERVICES';
  static readonly EMAIL = 
  `
    This is to confirm your booking with clinic ${this.CLINIC_NAME_VAR}:
    <br>
    <br>
    ${this.BOOKING_DETAILS_VAR}
    <br>
    ${this.SERVICES_VAR}
    <br>
    <br>
    Thank you for booking with us. If you need anything else related to your booking, feel free to ask our team.
    <br>
    <br>
    Keep enjoying our services!
  `;
}