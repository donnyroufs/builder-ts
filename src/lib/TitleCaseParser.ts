export class TitleCaseParser {
  public static parse(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }
}
