import { TestBed } from "@angular/core/testing";
import { ApiClientService } from "./api-client.service";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";

describe("ApiClientService", () => {
  let service: ApiClientService;
  let httpMock: HttpTestingController;
  const baseURL = "http://localhost:3000";

  interface MockListResponse {
    id: string;
    title: string;
  }

  
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
      ],
      providers: [ApiClientService]
    });
    service = TestBed.inject(ApiClientService);
    httpMock = TestBed.inject(HttpTestingController);
  });


  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should perform GET request", () => {
    const mockResponse = { id: "1", title: "Jane" };

    service.get<MockListResponse>("test-endpoint").subscribe(response => {
      expect(response).toEqual(mockResponse);
    });
    const req = httpMock.expectOne(`${baseURL}/test-endpoint`);
    expect(req.request.method).toBe("GET");
    req.flush(mockResponse);
  });

  
  it("should perform POST request", () => {
    const payload = { title: "John" };
    const mockResponse = { id: "1", title: "John" };

    service.post<MockListResponse>("lists", payload).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseURL}/lists`);
    expect(req.request.method).toBe("POST");
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it("should perform PUT request", () => {
    const payload = { title: "Jane" };
    const mockResponse = { id: "1", title: "Jane" };

    service.put<MockListResponse>("lists/1", payload).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseURL}/lists/1`);
    expect(req.request.method).toBe("PUT");
    expect(req.request.body).toEqual(payload);
    req.flush(mockResponse);
  });

  it("should perform DELETE request", () => {
    const mockResponse = { id: "1", title: "Jane" };

    service.delete<MockListResponse>("lists/1").subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${baseURL}/lists/1`);
    expect(req.request.method).toBe("DELETE");
    req.flush(mockResponse);
  });

});