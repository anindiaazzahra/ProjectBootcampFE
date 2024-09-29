using System.ComponentModel.DataAnnotations.Schema;

namespace PeerLandingFE.DTO.Req
{
    public class ReqLoanDto
    {
        public string borrowerId { get; set; }

        public decimal Amount { get; set; }

        public decimal InterestRate { get; set; }

    }
}
