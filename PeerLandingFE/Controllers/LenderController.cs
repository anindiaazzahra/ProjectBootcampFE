﻿using Microsoft.AspNetCore.Mvc;

namespace PeerLandingFE.Controllers
{
    public class LenderController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult MstLoan()
        {
            return View();
        }

        public IActionResult HistoryLoan()
        {
            return View();
        }
    }
}
