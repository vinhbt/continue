import { ConfigJson } from "@continuedev/config-types";
import fetch, { RequestInit, Response } from "node-fetch";
import { ModelDescription, PromptPublish } from "../index.js";

export interface ControlPlaneSessionInfo {
  accessToken: string;
  account: {
    label: string;
    id: string;
  };
}

export interface ControlPlaneWorkspace {
  id: string;
  name: string;
  settings: ConfigJson;
}

export interface ControlPlaneModelDescription extends ModelDescription {}

//local-s
export const CONTROL_PLANE_VTI_URL = "http://localhost:3001/api/v1/";

export const CONTROL_PLANE_URL =
  process.env.CONTROL_PLANE_ENV === "local"
    ? "http://localhost:3001/"
    : "https://control-plane-api-service-i3dqylpbqa-uc.a.run.app/";

export class ControlPlaneClient {
  //private static URL = CONTROL_PLANE_URL;
  private static URL = CONTROL_PLANE_VTI_URL;
  private static ACCESS_TOKEN_VALID_FOR_MS = 1000 * 60 * 5; // 5 minutes

  private lastAccessTokenRefresh = 0;

  constructor(
    private readonly sessionInfoPromise: Promise<
      ControlPlaneSessionInfo | undefined
    >,
  ) {}

  get userId(): Promise<string | undefined> {
    return this.sessionInfoPromise.then(
      (sessionInfo) => sessionInfo?.account.id,
    );
  }

  async getAccessToken(): Promise<string | undefined> {
    return (await this.sessionInfoPromise)?.accessToken;
  }

  private async request(path: string, init: RequestInit): Promise<Response> {
    const accessToken = await this.getAccessToken();
    if (!accessToken) {
      throw new Error("No access token");
    }
    const url = new URL(path, ControlPlaneClient.URL).toString();
    const resp = await fetch(url, {
      ...init,
      headers: {
        ...init.headers,
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!resp.ok) {
      throw new Error(
        `Control plane request failed: ${resp.status} ${await resp.text()}`,
      );
    }

    return resp;
  }

  public async listWorkspaces(): Promise<ControlPlaneWorkspace[]> {
    const userId = await this.userId;
    if (!userId) {
      return [];
    }

    try {
      const resp = await this.request("workspaces", {
        method: "GET",
      });
      return (await resp.json()) as any;
    } catch (e) {
      return [];
    }
  }

  async getSettingsForWorkspace(workspaceId: string): Promise<ConfigJson> {
    const userId = await this.userId;
    if (!userId) {
      throw new Error("No user id");
    }

    const resp = await this.request(`workspaces/${workspaceId}`, {
      method: "GET",
    });
    return ((await resp.json()) as any).settings;
  }

  async publishPromptForWorkspace(data: PromptPublish): Promise<PromptPublish> {
    const userId = await this.userId;
    if (!userId) {
      throw new Error("No user id");
    }

    const init: RequestInit = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    const resp = await this.request(`workspaces/prompts`, init);
    return (await resp.json()) as PromptPublish;
  }

}
