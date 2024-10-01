export interface ReqResUserListResponse {
    message: string;
    result:  Result;
}

export interface Result {
    films:     string;
    people:    string;
    planets:   string;
    species:   string;
    starships: string;
    vehicles:  string;
}
