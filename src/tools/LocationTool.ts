import { Tool } from "langchain/tools";
import axios from "axios";

export class LocationTool extends Tool {
  protected async _call(input: string): Promise<string> {

    return new Promise(async (resolve, reject) => {
      const url = "https://ipinfo.io/json";
      const response = await axios.get(url);
      const data = response.data;
      console.log(data);
      resolve(`${data.city} ${data.region} ${data.country}`);
    });

  }
  description: string = "Tool to get location from ipinfo.io";
  name: string = "LocationTool";
}
