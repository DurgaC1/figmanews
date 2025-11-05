export interface ApiResponse<T = any> {
    data: T;
    success: boolean;
    message?: string;
    meta?: {
      page?: number;
      limit?: number;
      total?: number;
      hasMore?: boolean;
    };
  }
  
  export interface ApiError {
    message: string;
    code: string;
    statusCode: number;
    details?: any;
  }
  
  export interface PaginatedParams {
    page?: number;
    limit?: number;
    cursor?: string;
  }
  
  export interface EventPayload {
    event: string;
    properties: Record<string, any>;
    timestamp: string;
  }
  