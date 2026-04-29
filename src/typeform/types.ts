export interface FormListItem {
  id: string;
  type: string;
  title: string;
  last_updated_at: string;
  created_at: string;
}

export interface FormListResponse {
  page_count: number;
  items: FormListItem[];
}

export interface ResponseItem {
  token: string;
  [key: string]: unknown;
}

export interface ResponsesPage {
  items: ResponseItem[];
}

export interface FormState {
  last_response_token: string | null;
  total_responses: number;
}

export interface ExtractionState {
  last_run_at: string;
  forms: Record<string, FormState>;
}
