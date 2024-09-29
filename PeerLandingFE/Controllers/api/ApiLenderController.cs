using Microsoft.AspNetCore.Mvc;
using PeerLandingFE.DTO.Req;
using PeerLandingFE.DTO.Res;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using static PeerLandingFE.DTO.Res.ResLoginDto;

namespace PeerLandingFE.Controllers.api
{
    public class ApiLenderController : Controller
    {
        private readonly HttpClient _httpClient;

        public ApiLenderController(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        [HttpPut]
        public async Task<IActionResult> UpdateSaldo(string id, [FromBody] ReqAddSaldoDto reqAddSaldoDto)
        {
            if (reqAddSaldoDto == null)
            {
                return BadRequest("Invalid user data.");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqAddSaldoDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"https://localhost:7093/rest/v1/user/UpdateSaldo/{id}", content);
            if (response.IsSuccessStatusCode)
            {
                return Ok("Saldo updated successfully.");
            }
            else
            {
                return BadRequest("Failed to update saldo.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetAllLoans(string status, string idLender, string borrowerId)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7093/rest/v1/loan/LoanList?status={status}&idLender={idLender}&borrowerId={borrowerId}");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to fetch loans.");
            }
        }

        [HttpPut]
        public async Task<IActionResult> UpdateLoanStatus(string id, ReqEditLoanStatusDto reqEditLoanStatusDto)
        {
            if (reqEditLoanStatusDto == null)
            {
                return BadRequest("Invalid user data.");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqEditLoanStatusDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");

            var response = await _httpClient.PutAsync($"https://localhost:7093/rest/v1/loan/UpdateLoan/{id}", content);

            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }
            else
            {
                return BadRequest("Failed to update user.");
            }
        }

        [HttpPost]
        public async Task<IActionResult> ApproveLoan([FromBody] ReqApproveLoanDto reqApproveLoanDto)
        {
            if (reqApproveLoanDto == null)
            {
                return BadRequest("Invalid funding data.");
            }

            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var json = JsonSerializer.Serialize(reqApproveLoanDto);
            var content = new StringContent(json, Encoding.UTF8, "application/json");
            
            Console.WriteLine(json);
            Console.WriteLine(reqApproveLoanDto);

            var response = await _httpClient.PostAsync("https://localhost:7093/rest/v1/funding/ApproveFunding", content);

            if (response.IsSuccessStatusCode)
            {
                var jsonData = await response.Content.ReadAsStringAsync();
                return Ok(jsonData);
            }
            else
            {
                return BadRequest("Failed to add funding.");
            }
        }

        [HttpGet]
        public async Task<IActionResult> GetHistoryLoans(string status, string idLender, string borrowerId)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.GetAsync($"https://localhost:7093/rest/v1/repayment/RepaymentList?{status}&idLender={idLender}&borrowerId={borrowerId}");

            if (response.IsSuccessStatusCode)
            {
                var responseData = await response.Content.ReadAsStringAsync();
                return Ok(responseData);
            }
            else
            {
                return BadRequest("Failed to fetch loans.");
            }
        }
    }
}
