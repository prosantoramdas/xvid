var detached_captcha, se_msg_timeout_id, myChart, price_lock_interval, stop_autobet = !1,
    autobet_dnr = !1,
    autobet_running = !1,
    free_play_sound = !1,
    last_nonce = 0,
    autobet_history = [],
    submissionEnabled = !0,
    bet_history_page = 0,
    jackpot_costs = ["", "0.00000002", "0.00000013", "0.00000125", "0.00001250", "0.00012500"],
    bonus_table_closed = 0,
    hide_pending_payments = 0,
    hide_pending_deposits = 0,
    profile_withdraw_address = "",
    withdraw_max_amount = 0,
    balance_last_changed = 0,
    wagering_contest_winners_round_display = current_contest_round - 1,
    lottery_winners_round_display = latest_lottery_round - 1,
    parimutuel_all_events_json = "",
    parimutuel_bet_history_json = "",
    countup_setintervals = {},
    new_user_first_load = 0,
    user_stats_loaded = 0,
    fingerprint = $.fingerprint(),
    daily_jp_countup_stop = 0,
    user_daily_jp_rank = 0,
    user_daily_jp_wagered = 0,
    rp_rewards_list_loaded = 0,
    initial_public_stats_loaded = 0,
    post_loaded = 0,
    wager_contest_winners = null,
    lottery_previous_winners = null,
    current_page_tab = "free_play",
    thirty_day_arr_btc = [],
    thirty_day_arr_usd = [],
    thirty_day_arr_time = [],
    fun_price_btc = 0,
    fun_sell_price_btc = 0,
    user_fun_balance = 0,
    user_btc_balance = 0,
    max_fun_can_buy = 0,
    daily_interest_rate = .0109589,
    f_w_fee = 500,
    rp_wof_price = 40,
    user_flash_offer = 0,
    show_ftd_offer = 0;

function BetErrors(e) {
    "e1" == e && ($("#double_your_btc_error").html("Insufficient balance to make this bet"), $("#low_balance_modal_link").click()), "e2" == e && $("#double_your_btc_error").html("Bet amount cannot be less than 0.00000001 BTC"), "e3" == e && $("#double_your_btc_error").html("Bet amount cannot be empty"), "e4" == e && $("#double_your_btc_error").html("Invalid bet method"), "e5" == e && $("#double_your_btc_error").html("Bet amount cannot be more than " + max_win_amount + " BTC"), "e6" == e && $("#double_your_btc_error").html("Please reload the page."), "e7" == e && $("#double_your_btc_error").html("Payout multiplier has to be between 2x and 4750x"), "e8" == e && $("#double_your_btc_error").html("Win amount cannot be more than " + max_win_amount + " BTC"), "e9" == e && ($("#double_your_btc_error").html("Your balance is insufficient to make this bet and try to win the jackpot<BR>Please un-select the jackpot bet option and try again"), $("#low_balance_modal_link").click()), "e10" == e && $("#double_your_btc_error").html("Client Seed is either empty or has invalid characters (only letters and numbers allowed).<BR>Please correct it by clicking on the PROVABLY FAIR link above."), "e11" == e && $("#double_your_btc_error").html("Please wait for your previous bet to finish rolling."), "e12" == e && $("#double_your_btc_error").html("Betting is disabled in your country."), "e13" == e && $("#double_your_btc_error").html("Please deposit bitcoins first to make a bet using a multiplier over 100x.")
}

function DoubleYourBTC(e) {
    $("#double_your_btc_digits").show();
    var t, a, o, n, i, s = 1;
    $("#disable_animation_checkbox").is(":checked") && (s = 0), 1 == s && (t = setInterval((function() {
        $("#multiplier_first_digit").html(Math.floor(10 * Math.random()))
    }), 10), a = setInterval((function() {
        $("#multiplier_second_digit").html(Math.floor(10 * Math.random()))
    }), 10), o = setInterval((function() {
        $("#multiplier_third_digit").html(Math.floor(10 * Math.random()))
    }), 10), n = setInterval((function() {
        $("#multiplier_fourth_digit").html(Math.floor(10 * Math.random()))
    }), 10), i = setInterval((function() {
        $("#multiplier_fifth_digit").html(Math.floor(10 * Math.random()))
    }), 10)), $("#double_your_btc_bet_hi_button").attr("disabled", !0), $("#double_your_btc_bet_lo_button").attr("disabled", !0);
    var r = $("#double_your_btc_stake").val(),
        l = 0,
        _ = $(".play_jackpot:checkbox:checked").map((function() {
            return this.value
        })).get();
    _.length > 0 && (l = _.toString());
    var c = $("#next_client_seed").val();
    $.get("/cgi-bin/bet.pl?m=" + e + "&client_seed=" + c + "&jackpot=" + l + "&stake=" + r + "&multiplier=" + $("#double_your_btc_payout_multiplier").val() + "&rand=" + Math.random(), (function(_) {
        console.log(_)
        var c = _.split(":");
        if ($("#double_your_btc_error").html(""), $("#double_your_btc_error").hide(), $("#double_your_btc_stake").removeClass("input-error"), $("#double_your_btc_bet_win").html(""), $("#double_your_btc_bet_lose").html(""), $("#double_your_btc_bet_win").hide(), $("#double_your_btc_bet_lose").hide(), $("#jackpot_message").removeClass("green"), $("#jackpot_message").removeClass("red"), $("#jackpot_message").html(""), $("#jackpot_message").hide(), $("#double_your_btc_result").show(), "s1" == c[0]) {
            var d = c[2],
                u = d.split("");
            if (d.toString().length < 5)
                for (var p = 5 - d.toString().length, b = 0; b < p; b++) u.unshift("0");
            1 == s && (clearInterval(t), clearInterval(a), clearInterval(o), clearInterval(n), clearInterval(i)), $("#multiplier_first_digit").html(u[0]), $("#multiplier_second_digit").html(u[1]), $("#multiplier_third_digit").html(u[2]), $("#multiplier_fourth_digit").html(u[3]), $("#multiplier_fifth_digit").html(u[4]), $("#balance").html(c[3]), max_deposit_bonus = parseFloat(c[18]).toFixed(8), balanceChanged(), $("#balance_usd").html(c[5]), $("#next_server_seed_hash").val(c[6]), $("#next_nonce").html(c[8]), $(".previous_server_seed").html(c[9]), $(".previous_server_seed").val(c[9]), $("#previous_server_seed_hash").val(c[10]), $(".previous_client_seed").html(c[11]), $(".previous_client_seed").val(c[11]), $(".previous_nonce").html(c[12]), $("#previous_roll").html(c[2]), $("#no_previous_rolls_msg").hide(), $("#previous_rolls_table").show(), $("#previous_roll_strings").show(), $("#bonus_account_balance").html(c[16] + " BTC"), $("#bonus_account_wager").html(c[17] + " BTC"), (parseFloat(c[16]) <= 0 || parseFloat(c[17]) <= 0) && 0 == bonus_table_closed && setTimeout((function() {
                $("#bonus_account_table").hide(), $("#user_claimed_deposit_bonus").hide(), bonus_table_closed = 1
            }), 5e3), max_deposit_bonus >= parseFloat(min_bonus_amount) && 1 == bonus_table_closed && $("#bonus_eligible_msg").show(), parseFloat(c[19]) > 0 && parseFloat(c[19]) < 100 && ($(".multiply_max_bet").html(c[19] + " BTC"), $(".multiply_max_bet").val(c[19]), max_win_amount = parseFloat(c[19])), $("#verify_rolls_link").attr("href", "https://s3.amazonaws.com/roll-verifier/verify.html?server_seed=" + c[9] + "&client_seed=" + c[11] + "&server_seed_hash=" + c[10] + "&nonce=" + c[12]), last_nonce = c[12];
            var m = e.toUpperCase();
            "w" == c[1] && ($("#double_your_btc_bet_win").show(), $("#double_your_btc_bet_win").html("You BET " + m + " so you win " + c[4] + " BTC!"), $("#manual_enable_sounds").is(":checked") && $.ionSound.play("bell_ring")), "l" == c[1] && ($("#double_your_btc_bet_lose").show(), $("#double_your_btc_bet_lose").html("You BET " + m + " so you lose " + c[4] + " BTC"), $("#manual_enable_sounds").is(":checked") && $.ionSound.play("tap")), 0 != l && ($("#jackpot_message").show(), "1" == c[13] ? ($("#jackpot_message").addClass("green"), $("#jackpot_message").html("Congratulations! You have won the jackpot of " + c[15] + " BTC")) : ($("#jackpot_message").addClass("red"), $("#jackpot_message").html("Sorry, you did not win the jackpot."))), parseFloat($("#balance").html()) + parseFloat($("#bonus_account_balance").html()) < 2e-8 && $("#low_balance_modal_link").click(), $("#double_your_btc_bet_hi_button").attr("disabled", !1), $("#double_your_btc_bet_lo_button").attr("disabled", !1), insertIntoBetHistory(c[1], c[4], c[2], c[9], c[11], c[10], c[12], "DICE", e, l, r, $("#double_your_btc_payout_multiplier").val(), c[20], c[21], c[22], c[23], 0, "normal")
        } else $("#double_your_btc_error").show(), $("#double_your_btc_digits").hide(), parseFloat(c[1]) > 0 && parseFloat(c[1]) < 100 && ($(".multiply_max_bet").html(c[1] + " BTC"), $(".multiply_max_bet").val(c[1]), max_win_amount = parseFloat(c[1])), BetErrors(c[0]), 1 == s && (clearInterval(t), clearInterval(a), clearInterval(o), clearInterval(n), clearInterval(i)), $("#multiplier_first_digit").html(0), $("#multiplier_second_digit").html(0), $("#multiplier_third_digit").html(0), $("#multiplier_fourth_digit").html(0), $("#multiplier_fifth_digit").html(0), "e6" == c[0] ? ($("#double_your_btc_bet_hi_button").attr("disabled", !0), $("#double_your_btc_bet_lo_button").attr("disabled", !0)) : ($("#double_your_btc_bet_hi_button").attr("disabled", !1), $("#double_your_btc_bet_lo_button").attr("disabled", !1))
    })).fail((function() {
        $("#double_your_btc_result").show(), $("#double_your_btc_error").show(), $("#double_your_btc_digits").hide(), $("#double_your_btc_error").html("Request timed out. Please try again."), 1 == s && (clearInterval(t), clearInterval(a), clearInterval(o), clearInterval(n), clearInterval(i)), $("#multiplier_first_digit").html(0), $("#multiplier_second_digit").html(0), $("#multiplier_third_digit").html(0), $("#multiplier_fourth_digit").html(0), $("#multiplier_fifth_digit").html(0), $("#double_your_btc_bet_hi_button").attr("disabled", !1), $("#double_your_btc_bet_lo_button").attr("disabled", !1)
    }))
}

function title_countdown(e) {
    var t = new Date / 1e3 + e;
    setInterval((function() {
        if (e < 1) $("title").html("0m:0s - FreeBitco.in - Win free bitcoins every hour!");
        else {
            e = t - new Date / 1e3 - 1;
            var a = Math.floor(e / 60),
                o = Math.floor(e - 60 * a);
            $("title").html(a + "m:" + o + "s - FreeBitco.in - Win free bitcoins every hour!")
        }
    }), 1e3)
}

function ShowMoreRefs(e) {
    var t = parseInt($("#referrals_shown").val(), 0);
    $.get("/?op=show_more_refs&start=" + t + "&count=" + e, (function(a) {
        $("#referral_list_table").append(a), 10 == e ? $("#referrals_shown").val(t + 10) : 20 == e ? $("#referrals_shown").val(t + 20) : 9999999 == e && $("#show_more_refs_options").hide()
    }))
}

function ShowAdvancedStats(e) {
    $.get("/?op=show_advanced_stats&days=" + e, (function(e) {
        $("#detailed_ref_stats_table").show(), $("#detailed_ref_stats_table").find("tr:gt(0)").remove(), $("#detailed_ref_stats_table").append(e)
    }))
}

function SwitchTabs() {
    $("#top_leader_iframe").attr("src", $("#top_leader_iframe").attr("src")), $("#left_sky_iframe").attr("src", $("#left_sky_iframe").attr("src")), $("#right_sky_iframe").attr("src", $("#right_sky_iframe").attr("src"))
}

function GenerateDepositAddress() {
    $.get("/?op=generate_bitcoin_deposit_address", (function(e) {
        $("#deposit_address").html('<p>Send bitcoins to the address below to top up your advertising account balance.</p><p><div style="width:400px;"><input type="text" size=40 style="text-align:center;" value="' + e + '" onClick="this.select();"></div></p>')
    }))
}

function DeleteAdCampaign(e) {
    1 == confirm("Are you sure you wish to delete this ad campaign? Deleting an ad campaign also deletes it's stats. If you wish to stop running this ad but want to retain it's stats, please pause it instead. Click OK if you would like to proceed with deleting this ad campaign else click CANCEL.") && ($("#ad_campaign_" + e).hide(), $("#ad_campaign_details_" + e).hide(), $.get("/?op=delete_ad_campaign&id=" + e, (function() {})))
}

function StartAdCampaign(e) {
    $("#start_pause_ad_campaign_icon_" + e).html('<a href="javascript:void(0);" onclick="PauseAdCampaign(' + e + ');"><img src="//static1.freebitco.in/images/pause3.png" border=0 alt="PAUSE"></a>'), $("#ad_campaign_status_" + e).html('<span style="color:#006600;">RUNNING</span>'), $.get("/?op=start_ad_campaign&id=" + e, (function(t) {
        "e2" == t && ($("#ad_campaign_status_" + e).html('<span style="color:red;">REFILL ADVERTISING ACCOUNT</span>'), $("#start_pause_ad_campaign_icon_" + e).html(""))
    }))
}

function PauseAdCampaign(e) {
    $("#start_pause_ad_campaign_icon_" + e).html('<a href="javascript:void(0);" onclick="StartAdCampaign(' + e + ');"><img src="//static1.freebitco.in/images/start4.png" border=0 alt="START"></a>'), $("#ad_campaign_status_" + e).html('<span style="color:red;">PAUSED</span>'), $.get("/?op=pause_ad_campaign&id=" + e, (function() {}))
}

function ShowAdDetails(e) {
    $("#ad_details_table").hide(), $("#edit_ad_error").hide(), $("#edit_ad_success").hide(), $.get("/?op=show_ad_details&id=" + e, (function(t) {
        var a = t.split(":");
        $("#ad_details_table").show(), $("#ad_details_popup_campaign_name").val(a[0]), $("#ad_details_popup_banner_image").attr("src", "//fbtc-uab.freebitco.in/" + a[1]), $("#ad_details_popup_daily_budget").val(a[2]), $("#ad_details_popup_total_budget").val(a[3]), $("#ad_details_popup_destination_url").val(a[4]), $("#ad_details_popup_max_cpm").val(a[8]), $("#ad_details_popup_ad_id").val(e), $("#ad_details_popup_freq_cap").val(a[9]);
        var o = a[10].split(",");
        "1" == a[5] ? $("#ad_details_popup_adv_bit").prop("checked", !0) : $("#ad_details_popup_adv_bit").prop("checked", !1), "1" == a[6] ? $("#ad_details_popup_adv_doge").prop("checked", !0) : $("#ad_details_popup_adv_doge").prop("checked", !1);
        var n = a[7].split("_");
        $("#ad_details_popup_ad_position").html(n[0].charAt(0).toUpperCase() + n[0].slice(1) + " - " + n[1] + "x" + n[2]), $("#ad_details_target_country_code").val(o)
    }))
}

function ShowAdStats(e) {
    $("#daily_ad_stats_table").hide(), $.get("/?op=show_daily_ad_stats&id=" + e, (function(e) {
        var t = e.split(";");
        $("#daily_ad_stats_campaign_name").html(t[0]), t.shift(), $("#daily_ad_stats_table").show(), $("#daily_ad_stats_table").find("tr:gt(0)").remove();
        for (var a = t.length - 1, o = 0; o < a; o++) {
            var n = t[o].split(":");
            $("#daily_ad_stats_table").append("<tr><td>" + n[0] + "</td><td>" + commaSeparateNumber(n[1]) + "</td><td>" + commaSeparateNumber(n[2]) + "</td><td>" + n[3] + "</td><td>" + n[4] + "</td></tr>")
        }
        var i = t[a].split(":");
        $("#daily_ad_stats_table").append("<tr><td class=bold>TOTAL</td><td>" + commaSeparateNumber(i[0]) + "</td><td>" + commaSeparateNumber(i[1]) + "</td><td>" + i[2] + "</td><td>" + i[3] + "</td></tr>")
    }))
}

function RefreshAdBalance() {
    $.get("/?op=refresh_ad_balance", (function(e) {
        $("#ad_balance").html(e)
    }))
}

function UpdateAdStats() {
    $.get("/?op=update_ad_stats", (function(e) {
        for (var t = e.split(";"), a = 0; a < t.length; a++) {
            var o = t[a].split(":");
            o[1] < 2 ? ($("#ad_campaign_status_" + o[0]).html("<span style='color:#FF6600;'>PENDING APPROVAL</span>"), $("#start_pause_ad_campaign_icon_" + o[0]).html("")) : 2 == o[1] ? ($("#ad_campaign_status_" + o[0]).html("<span style='color:#006600;'>APPROVED</span>"), $("#start_pause_ad_campaign_icon_" + o[0]).html("<a href='javascript:void(0);' onclick='StartAdCampaign(" + o[0] + ");'><img src='//static1.freebitco.in/images/start4.png' border=0 alt='START'></a>")) : 3 == o[1] ? ($("#ad_campaign_status_" + o[0]).html("<span style='color:#006600;'>RUNNING</span>"), $("#start_pause_ad_campaign_icon_" + o[0]).html("<a href='javascript:void(0);' onclick='PauseAdCampaign(" + o[0] + ");'><img src='//static1.freebitco.in/images/pause3.png' border=0 alt='PAUSE'></a>")) : 4 == o[1] ? ($("#ad_campaign_status_" + o[0]).html("<span style='color:red;'>PAUSED</span>"), $("#start_pause_ad_campaign_icon_" + o[0]).html("<a href='javascript:void(0);' onclick='StartAdCampaign(" + o[0] + ");'><img src='//static1.freebitco.in/images/start4.png' border=0 alt='START'></a>")) : 5 == o[1] ? ($("#ad_campaign_status_" + o[0]).html("<span style='color:red;'>REJECTED&nbsp;<a href='javascript:void(0);' onclick='GetAdRejectedReason(" + o[0] + ", " + o[5] + ");'>?</a></span>"), $("#start_pause_ad_campaign_icon_" + o[0]).html("")) : 6 == o[1] ? ($("#ad_campaign_status_" + o[0]).html("<span style='color:red;'>EXCEEDED DAILY BUDGET</span>"), $("#start_pause_ad_campaign_icon_" + o[0]).html("<a href='javascript:void(0);' onclick='PauseAdCampaign(" + o[0] + ");'><img src='//static1.freebitco.in/images/pause3.png' border=0 alt='PAUSE'></a>")) : 7 == o[1] ? ($("#ad_campaign_status_" + o[0]).html("<span style='color:red;'>EXCEEDED TOTAL BUDGET</span>"), $("#start_pause_ad_campaign_icon_" + o[0]).html("<a href='javascript:void(0);' onclick='PauseAdCampaign(" + o[0] + ");'><img src='//static1.freebitco.in/images/pause3.png' border=0 alt='PAUSE'></a>")) : 8 == o[1] && ($("#ad_campaign_status_" + o[0]).html("<span style='color:red;'>REFILL ADVERTISING ACCOUNT</span>"), $("#start_pause_ad_campaign_icon_" + o[0]).html("")), $("#campaign_views_" + o[0]).html(commaSeparateNumber(o[2])), $("#campaign_clicks_" + o[0]).html(commaSeparateNumber(o[3])), $("#campaign_total_cost_" + o[0]).html(o[4])
        }
    }))
}

function commaSeparateNumber(e) {
    for (;
        /(\d+)(\d{3})/.test(e.toString());) e = e.toString().replace(/(\d+)(\d{3})/, "$1,$2");
    return e
}

function AutoBet(e, t, a, o, n, i, s, r, l, _, c, d, u, p, b, m, h, f, g, y) {
    if (1 != stop_autobet) {
        $("#double_your_btc_digits").show(), $("#autobet_results_box").show(), $("#double_your_btc_bet_hi_button").attr("disabled", !0), $("#double_your_btc_bet_lo_button").attr("disabled", !0);
        var w = parseFloat($("#double_your_btc_stake").val()).toFixed(8);
        parseFloat(w) > parseFloat(d) && (d = w), s = parseFloat(s).toFixed(2), r = parseFloat(r).toFixed(2);
        var v = 0,
            k = $(".play_jackpot:checkbox:checked").map((function() {
                return this.value
            })).get();
        k.length > 0 && (v = k.toString());
        var x = $("#next_client_seed").val(),
            C = e;
        "alternate" == e && (C = t % 2 == 0 ? "hi" : "lo"), $.get("/cgi-bin/bet.pl?m=" + C + "&client_seed=" + x + "&jackpot=" + v + "&stake=" + w + "&multiplier=" + $("#double_your_btc_payout_multiplier").val() + "&rand=" + Math.random(), (function(k) {
            var x = k.split(":");
            if ($("#double_your_btc_error").html(""), $("#double_your_btc_error").hide(), $("#double_your_btc_stake").removeClass("input-error"), $("#double_your_btc_bet_win").html(""), $("#double_your_btc_bet_lose").html(""), $("#double_your_btc_bet_win").hide(), $("#double_your_btc_bet_lose").hide(), $("#jackpot_message").removeClass("green"), $("#jackpot_message").removeClass("red"), $("#jackpot_message").html(""), $("#jackpot_message").hide(), $("#double_your_btc_result").show(), "s1" == x[0]) {
                t--, c++, $("#rolls_played_count").html(c), $("#rolls_remaining_count").html(t), $("#autobet_highest_bet").html(d + " BTC");
                var B = x[2],
                    T = B.split("");
                if (B.toString().length < 5)
                    for (var F = 5 - B.toString().length, S = 0; S < F; S++) T.unshift("0");
                $("#multiplier_first_digit").html(T[0]), $("#multiplier_second_digit").html(T[1]), $("#multiplier_third_digit").html(T[2]), $("#multiplier_fourth_digit").html(T[3]), $("#multiplier_fifth_digit").html(T[4]), $("#balance").html(x[3]), max_deposit_bonus = parseFloat(x[18]).toFixed(8), balanceChanged(), $("#balance_usd").html(x[5]), $("#next_server_seed_hash").val(x[6]), $("#next_nonce").html(x[8]), $(".previous_server_seed").html(x[9]), $(".previous_server_seed").val(x[9]), $("#previous_server_seed_hash").val(x[10]), $(".previous_client_seed").html(x[11]), $(".previous_client_seed").val(x[11]), $(".previous_nonce").html(x[12]), $("#previous_roll").html(x[2]), $("#no_previous_rolls_msg").hide(), $("#previous_rolls_table").show(), $("#previous_roll_strings").show(), $("#bonus_account_balance").html(x[16] + " BTC"), $("#bonus_account_wager").html(x[17] + " BTC"), (parseFloat(x[16]) <= 0 || parseFloat(x[17]) <= 0) && 0 == bonus_table_closed && setTimeout((function() {
                    $("#bonus_account_table").hide(), $("#user_claimed_deposit_bonus").hide(), bonus_table_closed = 1
                }), 5e3), max_deposit_bonus >= parseFloat(min_bonus_amount) && 1 == bonus_table_closed && $("#bonus_eligible_msg").show(), parseFloat(x[19]) > 0 && parseFloat(x[19]) < 100 && ($(".multiply_max_bet").html(x[19] + " BTC"), $(".multiply_max_bet").val(x[19]), max_win_amount = parseFloat(x[19])), $("#verify_rolls_link").attr("href", "https://s3.amazonaws.com/roll-verifier/verify.html?server_seed=" + x[9] + "&client_seed=" + x[11] + "&server_seed_hash=" + x[10] + "&nonce=" + x[12]), insertIntoBetHistory(x[1], x[4], x[2], x[9], x[11], x[10], x[12], "DICE", C, v, w, $("#double_your_btc_payout_multiplier").val(), x[20], x[21], x[22], x[23], 0, "normal");
                var I = C.toUpperCase();
                if ("w" == x[1]) {
                    if ($("#double_your_btc_bet_win").show(), $("#double_your_btc_bet_win").html("You BET " + I + " so you win " + x[4] + " BTC!"), x[4], p = parseFloat((1e8 * p + 1e8 * x[4]) / 1e8).toFixed(8), 1 == n) $("#double_your_btc_stake").val(parseFloat(o).toFixed(8));
                    else if (0 != parseFloat(s)) {
                        var E = parseFloat(w * (s / 100 + 1)).toFixed(8);
                        $("#double_your_btc_stake").val(E)
                    }
                    parseFloat(x[4]) > parseFloat(u) && (u = parseFloat(x[4]).toFixed(8)), $("#autobet_highest_win").html(u + " BTC"), 0 != b && ($("#double_your_btc_payout_multiplier").val(b), $("#double_your_btc_payout_multiplier").keyup()), 1 === y && $.ionSound.play("bell_ring")
                }
                if ("l" == x[1] && ($("#double_your_btc_bet_lose").show(), $("#double_your_btc_bet_lose").html("You BET " + I + " so you lose " + x[4] + " BTC"), x[4], p = parseFloat((1e8 * p - 1e8 * x[4]) / 1e8).toFixed(8), 1 == i ? $("#double_your_btc_stake").val(parseFloat(o).toFixed(8)) : 0 != r && (E = parseFloat(w * (r / 100 + 1)).toFixed(8), $("#double_your_btc_stake").val(E)), 0 != m && ($("#double_your_btc_payout_multiplier").val(m), $("#double_your_btc_payout_multiplier").keyup()), 1 === y && $.ionSound.play("tap")), 0 != v && ($("#jackpot_message").show(), "1" == x[13] ? ($("#jackpot_message").addClass("green"), $("#jackpot_message").html("Congratulations! You have won the jackpot of " + x[15] + " BTC")) : ($("#jackpot_message").addClass("red"), $("#jackpot_message").html("Sorry, you did not win the jackpot."))), $("#double_your_btc_bet_hi_button").attr("disabled", !1), $("#double_your_btc_bet_lo_button").attr("disabled", !1), $("#autobet_pl").removeClass(), $("#autobet_pl").addClass("bold"), parseFloat(p) < 0 ? $("#autobet_pl").css({
                        "background-color": "#FF6666"
                    }) : $("#autobet_pl").css({
                        "background-color": "#33FF33"
                    }), $("#autobet_pl").html(p + " BTC"), t > 0) {
                    if (w = parseFloat($("#double_your_btc_stake").val()).toFixed(8), (parseFloat(w) > parseFloat(a) || parseFloat(w * ($("#double_your_btc_payout_multiplier").val() - 1)) > parseFloat(max_win_amount)) && (1 == _ ? $("#double_your_btc_stake").val(parseFloat(o).toFixed(8)) : stop_autobet = !0), 1 == l) {
                        charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                        var q = "";
                        for (S = 0; S < 16; S++) {
                            var A = Math.floor(Math.random() * charSet.length);
                            q += charSet.substring(A, A + 1)
                        }
                        $("#next_client_seed").val(q)
                    }(parseFloat(h) > 0 && parseFloat(p) >= parseFloat(h) || parseFloat(f) > 0 && parseFloat(p) <= -1 * parseFloat(f)) && (stop_autobet = !0), AutoBet(e, t, a, o, n, i, s, r, l, _, c, d, u, p, b, m, h, f, g, y)
                } else StopAutoBet()
            } else $("#double_your_btc_error").show(), $("#double_your_btc_digits").hide(), parseFloat(x[1]) > 0 && parseFloat(x[1]) < 100 && ($(".multiply_max_bet").html(x[1] + " BTC"), $(".multiply_max_bet").val(x[1]), max_win_amount = parseFloat(x[1])), BetErrors(x[0]), StopAutoBet(), "e6" == x[0] ? ($("#double_your_btc_bet_hi_button").attr("disabled", !0), $("#double_your_btc_bet_lo_button").attr("disabled", !0)) : ($("#double_your_btc_bet_hi_button").attr("disabled", !1), $("#double_your_btc_bet_lo_button").attr("disabled", !1))
        })).fail((function() {
            AutoBet(e, t, a, o, n, i, s, r, l, _, c, d, u, p, b, m, h, f, g)
        }))
    } else StopAutoBet()
}

function RefreshPageAfterFreePlayTimerEnds() {
    0 == autobet_dnr && (1 == free_play_sound && $.ionSound.play("jump_up"), window.location.replace("https://freebitco.in/?op=home"))
}

function StopAutoBet() {
    $("#double_your_btc_stake").val("0.00000001"), $("#double_your_btc_payout_multiplier").val(2), $("#double_your_btc_payout_multiplier").keyup(), $(".play_jackpot").prop("checked", !1), $("#auto_betting_button").show(), $("#stop_auto_betting").hide(), stop_autobet = !1, autobet_running = !1, autobet_dnr = !1, $("#start_autobet").removeClass("close-reveal-modal")
}

function GenerateMainDepositAddress() {
    $.get("/?op=generate_main_bitcoin_deposit_address", (function(e) {
        var t = e.split(":");
        DisplaySEMessage(t[0], t[1]), "s" == t[0] && ($("#main_deposit_address_box").show(), $("#main_deposit_address_qr_code").show(), $("#main_deposit_address_qr_code").html('<img src="//chart.googleapis.com/chart?cht=qr&chs=200x200&chl=' + t[2] + '&chld=H|0">'), $("#main_deposit_address").val(t[2]), $("#generate_new_address_msg").hide())
    }))
}

function GenerateETHDepositAddress() {
    $.get("/cgi-bin/api.pl?op=get_eth_address", (function(e) {
        "success" == e.status ? (DisplaySEMessage("s", "New address generated succesfully"), $("#eth_deposit_address_box").show(), $("#eth_deposit_address_qr_code").html('<img src="//chart.googleapis.com/chart?cht=qr&chs=200x200&chl=' + e.address + '&chld=H|0">'), $("#eth_deposit_address").val(e.address), $("#new_eth_address_button").hide()) : "error" == e.status ? DisplaySEMessage("e", e.msg) : DisplaySEMessage("e", "Unexpected error, please reload the page and try again.")
    }))
}

function FUNDW(e) {
    "deposit" == e ? ($("#fun_deposit_div").show(), $("#fun_withdraw_div").hide()) : "withdraw" == e && ($("#fun_withdraw_div").show(), $("#fun_deposit_div").hide())
}

function myDecisionFunction() {
    return !!submissionEnabled && (submissionEnabled = !1, !0)
}

function GetAdRejectedReason(e, t) {
    var a = "Ad Rejection Reason: ";
    1 == t ? alert(a + "Banner is too distracting.") : 2 == t ? alert(a + "Banner or website contains 18+ content.") : 3 == t ? alert(a + "Destination URL is invalid or does not load.") : 4 == t && $.get("/?op=banner_reject_reason&id=" + e, (function(e) {
        alert(a + e)
    }))
}

function UpdateUserStats() {
    socket_userid > 0 && ($.get("/cf_stats_private/?u=" + socket_userid + "&p=" + socket_password + "&f=user_stats", (function(e) {
        if ("success" == e.status) {
            var t = parseInt(e.lottery_tickets),
                a = parseInt(e.user_extras.reward_points),
                o = parseInt(e.user.balance),
                n = parseInt(e.lambo_lottery_tickets),
                i = parseInt(e.total_lambo_lottery_tickets);
            if (o > 0 && Math.floor(Date.now() / 1e3) - balance_last_changed > 300 && ($("#balance").html(parseFloat(o / 1e8).toFixed(8)), $("#earn_btc_acc_balance").val($("#balance").html()), $("#earn_btc_acc_balance").keyup(), balanceChanged()), t >= 0 && $("#user_lottery_tickets").html(ReplaceNumberWithCommas(t)), a >= 0 && $(".user_reward_points").html(ReplaceNumberWithCommas(a)), n >= 0 && i >= 0) {
                var s = parseFloat(n / i * 100).toFixed(8);
                $("#golden_lottery_win_chance").html(s)
            }
            if (n >= 0 && $("#user_golden_lottery_tickets").html(ReplaceNumberWithCommas(n)), i >= 0 && CountupTimer("#total_golden_lottery_tickets", i, 1.1, 0), e.unconf_tx.length > 0 && 0 == hide_pending_deposits) {
                $("#unconfirmed_deposits_table").show(), $("#unconfirmed_deposits_table_rows").html("");
                var r = "";
                1 == mobile_device && (r = "lottery_table_mobile_style");
                for (var l = 0; l < e.unconf_tx.length; l++) {
                    var _ = e.unconf_tx[l].tx_hash.substring(0, 12) + "..." + e.unconf_tx[l].tx_hash.substring(e.unconf_tx[l].tx_hash.length - 12);
                    1 == mobile_device && (_ = e.unconf_tx[l].tx_hash.substring(0, 10) + "..." + e.unconf_tx[l].tx_hash.substring(e.unconf_tx[l].tx_hash.length - 10));
                    var c = parseFloat(e.unconf_tx[l].amount / 1e8).toFixed(8);
                    $("#unconfirmed_deposits_table_rows").append('<div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-8 small-8 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + r + '"><a href="https://btc.com/' + e.unconf_tx[l].tx_hash + '" target=_blank>' + _ + '</a></div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + r + '">' + c + "</div></div></div>")
                }
            } else $("#unconfirmed_deposits_table").hide();
            var d = 0,
                u = 0;
            if (e.instant_payment_requests.length > 0 && 0 == hide_pending_payments)
                for (d = 1, $("#instant_pending_payout_table").show(), $("#instant_pending_payout_table").html(""), r = "", 1 == mobile_device && (r = "lottery_table_mobile_style"), $("#instant_pending_payout_table").append('<div class="large-12 small-12 columns center lottery_winner_table_box"><div class="center bold" style="margin:auto;">INSTANT</div></div>'), l = 0; l < e.instant_payment_requests.length; l++) {
                    c = parseFloat(e.instant_payment_requests[l].amount / 1e8).toFixed(8);
                    var p = e.instant_payment_requests[l].btc_address;
                    1 == mobile_device && (p = e.instant_payment_requests[l].btc_address.substring(0, 10) + "..." + e.instant_payment_requests[l].btc_address.substring(e.instant_payment_requests[l].btc_address.length - 10)), $("#instant_pending_payout_table").append('<div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-8 small-8 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + r + '"><a href="https://btc.com/' + e.instant_payment_requests[l].btc_address + '" target=_blank>' + p + '</a></div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + r + '">' + c + "</div></div>"), 1 == e.instant_payment_requests[l].block && (u = 1)
                } else $("#instant_pending_payout_table").hide();
            if (e.manual_payment_requests.length > 0 && 0 == hide_pending_payments)
                for (d = 1, $("#pending_payout_table").show(), $("#pending_payout_table").html(""), r = "", 1 == mobile_device && (r = "lottery_table_mobile_style"), $("#pending_payout_table").append('<div class="large-12 small-12 columns center lottery_winner_table_box"><div class="center bold" style="margin:auto;">SLOW</div></div>'), l = 0; l < e.manual_payment_requests.length; l++) c = parseFloat(e.manual_payment_requests[l].amount / 1e8).toFixed(8), p = e.manual_payment_requests[l].btc_address, 1 == mobile_device && (p = e.manual_payment_requests[l].btc_address.substring(0, 10) + "..." + e.manual_payment_requests[l].btc_address.substring(e.manual_payment_requests[l].btc_address.length - 10)), $("#pending_payout_table").append('<div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-8 small-8 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + r + '"><a href="https://btc.com/' + e.manual_payment_requests[l].btc_address + '" target=_blank>' + p + '</a></div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + r + '">' + c + "</div></div>"), 1 == e.manual_payment_requests[l].block && (u = 1);
            else $("#pending_payout_table").hide();
            1 == d ? ($("#pending_payouts_table_new").show(), 1 == u && $("#payout_manual_review_msg").show()) : $("#pending_payouts_table_new").hide(), parseInt(e.unblock_gbr.lottery_to_unblock) > 0 && parseFloat(e.unblock_gbr.deposit_to_unblock) > 0 && parseFloat(e.unblock_gbr.jackpot_to_unblock) > 0 && parseFloat(e.unblock_gbr.wager_to_unblock) > 0 ? (0 == new_user_first_load && $("#req_for_bonuses_link").show(), $("#unblock_modal_rp_bonuses_container").show(), $("#unblock_modal_rp_bonuses").html('<p>To play FREE BTC using a VPN/proxy, to be able to redeem all reward point bonuses and to get an alternative to hcaptcha:</p><div class="bold center account_unblock_options_box" id="option_container_play_multiply"><p class="bold">Purchase <span class="account_unblock_span option_play_multiply_span">' + ReplaceNumberWithCommas(e.unblock_gbr.lottery_to_unblock) + '</span> lottery tickets</p></div><h5 style="text-align: center;">OR</h5><div class="bold center account_unblock_options_box" id="option_container_deposit"><p class="bold">Wager <span class="account_unblock_span option_deposit_span">' + e.unblock_gbr.jackpot_to_unblock + ' BTC</span> in MULTIPLY BTC jackpots</p></div><h5 style="text-align: center;">OR</h5><div class="bold center account_unblock_options_box" id="option_container_buy_lottery"><p class="bold">Wager <span class="account_unblock_span option_buy_lottery_span">' + e.unblock_gbr.wager_to_unblock + ' BTC</span> in MULTIPLY BTC</p></div><h5 style="text-align: center;">OR</h5><div class="bold center account_unblock_options_box" id="option_container_fp_bonus"><p class="bold">Deposit <span class="account_unblock_span option_fp_bonus_span">' + e.unblock_gbr.deposit_to_unblock + " BTC</span> into your account to earn interest</p>")) : $("#unblock_modal_rp_bonuses_container").hide(), parseInt(e.no_captcha_gbr.lottery_to_unblock) > 0 && parseFloat(e.no_captcha_gbr.deposit_to_unblock) > 0 && parseFloat(e.no_captcha_gbr.jackpot_to_unblock) > 0 && parseFloat(e.no_captcha_gbr.wager_to_unblock) > 0 ? (0 == new_user_first_load && $("#req_for_bonuses_link").show(), $("#unblock_modal_no_captcha_container").show(), $("#unblock_modal_no_captcha").html('<p>To play FREE BTC without having to solve a captcha:</p><div class="bold center account_unblock_options_box" id="option_container_play_multiply"><p class="bold">Purchase <span class="account_unblock_span option_play_multiply_span">' + ReplaceNumberWithCommas(e.no_captcha_gbr.lottery_to_unblock) + '</span> lottery tickets</p></div><h5 style="text-align: center;">OR</h5><div class="bold center account_unblock_options_box" id="option_container_deposit"><p class="bold">Wager <span class="account_unblock_span option_deposit_span">' + e.no_captcha_gbr.jackpot_to_unblock + ' BTC</span> in MULTIPLY BTC jackpots</p></div><h5 style="text-align: center;">OR</h5><div class="bold center account_unblock_options_box" id="option_container_buy_lottery"><p class="bold">Wager <span class="account_unblock_span option_buy_lottery_span">' + e.no_captcha_gbr.wager_to_unblock + ' BTC</span> in MULTIPLY BTC</p></div><h5 style="text-align: center;">OR</h5><div class="bold center account_unblock_options_box" id="option_container_fp_bonus"><p class="bold">Deposit <span class="account_unblock_span option_fp_bonus_span">' + e.no_captcha_gbr.deposit_to_unblock + " BTC</span> into your account to earn interest</p>")) : $("#unblock_modal_no_captcha_container").hide(), void 0 !== e.wager_contest.wager_personal && $("#personal_wager_for_contest").html(parseFloat(e.wager_contest.wager_personal / 1e8).toFixed(8)), void 0 !== e.wager_contest.ref_contest_personal && $("#ref_wager_for_contest").html(parseFloat(e.wager_contest.ref_contest_personal / 1e8).toFixed(8)), void 0 !== e.user_daily_jp && null != e.user_daily_jp && (user_daily_jp_rank = e.user_daily_jp.rank, $("#daily_jp_user_rank").html("#" + user_daily_jp_rank), $("#daily_jackpot_user_rank").html(ReplaceNumberWithCommas(user_daily_jp_rank)), user_daily_jp_wagered = parseFloat(e.user_daily_jp.wagered / 1e8).toFixed(8), $("#daily_jackpot_user_wagered").html(user_daily_jp_wagered)), void 0 !== e.rp_wof_mx_tix && $("#rp_wof_max_tickets").html(e.rp_wof_mx_tix);
            var b = Math.floor((new Date).getTime() / 1e3);
            if (e.flash_offer_end > b) {
                user_flash_offer = 1;
                var m = "https://sirv.freebitco.in/1646130990_QgUkuYLO.png";
                $("body").innerWidth() < 769 ? 0 == new_user_first_load && $("#deposit_promo_message_mobile").show() : (m = "https://sirv.freebitco.in/1646131014_ODuuI5MS.png", 0 == new_user_first_load && $("#deposit_promo_message_regular").show()), $(".deposit_promo_message_content").html('<div style="display: inline-block; height: auto;" class="center deposit_promo_msg"><img src="' + m + '" data-reveal-id="flash_offer_modal"><div class="deposit_promo_time_remaining countdown_time_remaining" style="margin: auto; margin-top: 10px; margin-bottom: 10px;"></div></div>'), $(".deposit_promo_time_remaining").countdown("destroy"), $(".deposit_promo_time_remaining").countdown({
                    until: +(e.flash_offer_end - b),
                    format: "HMS"
                }), $("#flash_promo_wager").html(ReplaceNumberWithCommas(e.flash_offer_volume) + " SATOSHI (" + parseFloat(e.flash_offer_volume / 1e8).toFixed(8) + " BTC)"), $("#flash_offer_active_alert").show()
            } else if (0 == user_flash_offer) {
                var h, f = 0,
                    g = 0;
                if (show_ftd_offer = 1, void 0 !== e.bonus_mult && e.bonus_mult > 0 && void 0 !== e.ftd_bonus_end && e.ftd_bonus_end > 0 ? (f = e.bonus_mult, g = e.ftd_bonus_end) : void 0 !== e.ftd_bonus_waiting && e.ftd_bonus_waiting > 0 && void 0 !== e.ftd_bonus_waiting_end && e.ftd_bonus_waiting_end > 0 && (f = e.ftd_bonus_waiting, g = e.ftd_bonus_waiting_end, $(".ftd-step-1").hide(), $(".ftd-step-2").show()), void 0 !== f && f > 0) $("body").innerWidth() < 769 ? ($("#deposit_promo_message_mobile").show(), 120 == f ? h = "https://sirv.freebitco.in/1693814431_9a7fAkG3.png" : 60 == f ? h = "https://sirv.freebitco.in/1693814462_nqZQri7v.png" : 30 == f && (h = "https://sirv.freebitco.in/1693814489_4O2EjMoe.png")) : ($("#deposit_promo_message_regular").show(), 120 == f ? h = "https://sirv.freebitco.in/1693814417_Vhp3uycE.png" : 60 == f ? h = "https://sirv.freebitco.in/1693814444_NRfBQreL.png" : 30 == f && (h = "https://sirv.freebitco.in/1693814474_gZrdWGO0.png")), 120 == f ? ($("#deposit_bonus_banner").html("<img src='https://sirv.freebitco.in/1693563586_SThniiBz.png'>"), $(".deposit_bonus_mult").html("120")) : 60 == f ? ($("#deposit_bonus_banner").html("<img src='https://sirv.freebitco.in/1693563599_2ircTN3t.png'>"), $(".deposit_bonus_mult").html("60")) : 30 == f && ($("#deposit_bonus_banner").html("<img src='https://sirv.freebitco.in/1693563612_thuunC5M.png'>"), $(".deposit_bonus_mult").html("30")), $(".deposit_promo_message_content").html('<div style="display: inline-block; height: auto;" class="center deposit_promo_msg"><img src="' + h + '" data-reveal-id="ftd_modal"><div class="deposit_promo_time_remaining countdown_time_remaining" style="margin: auto; margin-top: 10px; margin-bottom: 10px;"></div></div>'), $(".deposit_promo_time_remaining").countdown("destroy"), $(".deposit_promo_time_remaining").countdown({
                    until: +g,
                    format: "HMS"
                })
            }
        }
    })), setTimeout(UpdateUserStats, 45e4))
}

function ReplaceNumberWithCommas(e) {
    var t = e.toString().split(".");
    return t[0] = t[0].replace(/\B(?=(\d{3})+(?!\d))/g, ","), t.join(".")
}

function CalculateWinAmount() {
    $(".gt").html(parseInt(Math.round(1e4 - 9500 / parseFloat($("#double_your_btc_payout_multiplier").val()).toFixed(2)))), $(".lt").html(parseInt(Math.round(9500 / parseFloat($("#double_your_btc_payout_multiplier").val()).toFixed(2))));
    var e = Math.floor($("#double_your_btc_stake").val() * (parseFloat(9500 / parseInt($(".lt").html())).toFixed(2) - 1) * 1e8 + 1e-6);
    $("#win_amount").html(parseFloat(e / 1e8).toFixed(8))
}

function AutoBetErrors(e) {
    $("#autobet_error").show(), $("#double_your_btc_result").hide(), $("#double_your_btc_middle_section").css({
        "border-radius": "0 0 10px 10px"
    }), "e1" == e && $("#autobet_error").html("Base bet has to be between 0.00000001 and " + max_win_amount + " BTC"), "e2" == e && $("#autobet_error").html("Bet odds has to be an integer between 1.01 and 4750"), "e3" == e && $("#autobet_error").html("Max bet has to be between 0.00000001 and " + max_win_amount + " BTC"), "e4" == e && $("#autobet_error").html("Bet count has to be atleast 1"), "e5" == e && $("#autobet_error").html("Bet odds after win has to be an integer between 1.01 and 4750"), "e6" == e && $("#autobet_error").html("Bet odds after lose has to be an integer between 1.01 and 4750"), "e7" == e && $("#autobet_error").html("Stop after profit value must be greater than 0"), "e8" == e && $("#autobet_error").html("Stop after loss value must be greater than 0"), "e13" == e && $("#autobet_error").html("Please deposit bitcoins first to make a bet using a multipllier over 100x.")
}

function ScreeSizeCSSChanges() {
    $("body").innerWidth() < 1256 && ($("#double_your_btc_middle_section").appendTo($("#double_your_btc_main_container_outer")), $("#double_your_btc_middle_section").css({
        "border-radius": "0 0 10px 10px"
    })), $("body").innerWidth() > 1100 && ($(".change_size_css").addClass("large-7"), $(".change_size_css").removeClass("large-10 large-12")), $("body").innerWidth() < 1256 && $("body").innerWidth() > 970 && ($("#double_your_btc_main_container").addClass("double_your_btc_main_container_to_add"), $("#double_your_btc_main_container").removeClass("double_your_btc_main_container_remove double_your_btc_main_container_to_add_small"), $("#double_your_btc_left_section").addClass("double_your_btc_left_section_to_add"), $("#double_your_btc_left_section").removeClass("double_your_btc_left_section_remove double_your_btc_left_section_to_add_small"), $("#double_your_btc_middle_section").addClass("double_your_btc_middle_section_to_add"), $("#double_your_btc_middle_section").removeClass("double_your_btc_middle_section_remove double_your_btc_middle_section_to_add_small"), $("#double_your_btc_right_section").addClass("double_your_btc_right_section_to_add"), $("#double_your_btc_right_section").removeClass("double_your_btc_right_section_remove double_your_btc_right_section_to_add_small"), $("#double_your_btc_auto_bet_left_section").addClass("double_your_btc_left_section_to_add"), $("#double_your_btc_auto_bet_left_section").removeClass("double_your_btc_left_section_remove double_your_btc_left_section_to_add_small"), $("#double_your_btc_auto_bet_right_section").addClass("double_your_btc_auto_bet_right_section_to_add"), $("#double_your_btc_auto_bet_right_section").removeClass("double_your_btc_auto_bet_right_section_remove double_your_btc_auto_bet_right_section_to_add_small"), $("#bet_hi_button").addClass("bet_hi_button_to_add"), $("#bet_hi_button").removeClass("bet_hi_button_remove bet_hi_button_to_add_small"), $("#bet_lo_button").addClass("bet_lo_button_to_add"), $("#bet_lo_button").removeClass("bet_lo_button_remove bet_lo_button_to_add_small")), $("body").innerWidth() < 1100 && $("body").innerWidth() > 970 && ($(".change_size_css").addClass("large-10"), $(".change_size_css").removeClass("large-7 large-12")), $("body").innerWidth() < 971 && ($("#double_your_btc_main_container").addClass("double_your_btc_main_container_to_add_small"), $("#double_your_btc_main_container").removeClass("double_your_btc_main_container_remove double_your_btc_main_container_to_add"), $("#double_your_btc_left_section").addClass("double_your_btc_left_section_to_add_small"), $("#double_your_btc_left_section").removeClass("double_your_btc_left_section_remove double_your_btc_left_section_to_add"), $("#double_your_btc_middle_section").addClass("double_your_btc_middle_section_to_add_small"), $("#double_your_btc_middle_section").removeClass("double_your_btc_middle_section_remove double_your_btc_middle_section_to_add"), $("#double_your_btc_right_section").addClass("double_your_btc_right_section_to_add_small"), $("#double_your_btc_right_section").removeClass("double_your_btc_right_section_remove double_your_btc_right_section_to_add"), $("#double_your_btc_auto_bet_left_section").addClass("double_your_btc_left_section_to_add_small"), $("#double_your_btc_auto_bet_left_section").removeClass("double_your_btc_left_section_remove double_your_btc_left_section_to_add"), $("#double_your_btc_auto_bet_right_section").addClass("double_your_btc_auto_bet_right_section_to_add_small"), $("#double_your_btc_auto_bet_right_section").removeClass("double_your_btc_auto_bet_right_section_remove double_your_btc_auto_bet_right_section_to_add"), $("#bet_hi_button").addClass("bet_hi_button_to_add_small"), $("#bet_hi_button").removeClass("bet_hi_button_remove bet_hi_button_to_add"), $("#bet_lo_button").addClass("bet_lo_button_to_add_small"), $("#bet_lo_button").removeClass("bet_lo_button_remove bet_lo_button_to_add"), $(".change_size_css").addClass("large-12"), $(".change_size_css").removeClass("large-7 large-10"))
}

function ShowNews(e) {
    $("#news_content_" + e).show()
}

function GetNewsContent(e, t, a) {
    $.get("/?op=get_news_content&id=" + t, (function(o) {
        $("#news_content_" + t).remove(), $(a).parent().after('<div class="large-11 small-12 large-centered columns ' + e + 'news_content" style="text-align:left;" id="news_content_' + t + '">' + o + "</div>")
    }))
}

function GetBetHistory(e, t) {
    e >= 0 && (bet_history_page = e, $("#newer_bet_history").attr("disabled", !0), $("#older_bet_history").attr("disabled", !0), $.get("/cf_stats_private/?u=" + socket_userid + "&p=" + socket_password + "&f=bet_history&page=" + e + "&ln=" + t, (function(e) {
        $("#bet_history_table_rows").html(""), console.log(e.data);
        for (var t = e.data.length - 1; t >= 0; t--) {
            var a = e.data[t].split(":");
            a[0] = a[0].replace(/\./g, ":");
            var o = formatDate(a[0] + " MST"),
                n = "normal";
            "m" == a[10] ? a[10] = "DICE" : "f" == a[10] ? a[10] = "FREE" : "r" == a[10] ? a[10] = "ROULETTE" : "w" == a[10] && (a[10] = "WOF", "lot" != (n = a[18]) && "rp" != n && "gt" != n || (a[14] = a[16], a[15] = a[17]));
            var i = "l";
            a[3] >= 0 && (i = "w"), a[3] = a[3].replace("-", ""), insertIntoBetHistory(i, a[3], a[2], a[7], a[8], a[11], a[9], a[10], a[4], a[5], a[6], a[1], a[12], a[13], a[14], a[15], o, n)
        }
        $("#newer_bet_history").attr("disabled", !1), $("#older_bet_history").attr("disabled", !1)
    })))
}

function formatDate(e) {
    e && (e = e.replace(/-/g, "/"));
    var t = new Date(e || Date.now()),
        a = "" + (t.getMonth() + 1),
        o = "" + t.getDate(),
        n = t.getFullYear(),
        i = "" + t.getHours(),
        s = "" + t.getMinutes(),
        r = "" + t.getSeconds();
    return a.length < 2 && (a = "0" + a), o.length < 2 && (o = "0" + o), i.length < 2 && (i = "0" + i), s.length < 2 && (s = "0" + s), r.length < 2 && (r = "0" + r), o + "/" + a + "/" + n + " " + i + ":" + s + ":" + r
}

function SwitchPageTabs(e) {
    $(".page_tabs").hide(), $("#" + e + "_tab").show(), $("#box_ad_bottom_mobile").hide(), $("#box_ad_bottom_desktop").hide(), $("#main_content_ad_left").hide(), $("#main_content").css("padding", "auto"), $("#main_content").css("margin", "auto"), $("html, body").animate({
        scrollTop: 0
    }, "fast"), $(".tabs li").removeClass("active"), $("." + e + "_link").parent().addClass("active"), current_page_tab = e, "free_play" == e && ($("#box_ad_bottom_mobile").show(), $("#box_ad_bottom_desktop").show(), 1 == show_sky && ($("#main_content").addClass("push-3"), $("#main_content").removeClass("large-centered new_border_shadow"), $("#main_content_ad_left").show(), $("#main_content").css("padding", 0), $("#main_content").css("margin", 0))), "double_your_btc" == e ? (GetBetHistory(0, last_nonce), $(".deposit_promo_message_content").hide(), $("#myModal22").foundation("reveal", "close")) : $(".deposit_promo_message_content").show(), "earn_btc" == e && $("#myModal15").foundation("reveal", "close"), "betting" == e ? changeContainerDiv_parimutuel() : changeContainerDiv_others_parimutuel(), "golden_ticket" == e && ($("#myModal16").foundation("reveal", "close"), $("#golden_ticket_lambo_main_image").attr("src", "https://sirv.freebitco.in/1605529058_KR4cF23z.jpg"), $("#golden_ticket_step1").attr("src", "https://sirv.freebitco.in/1572662552_fw9g8rpx.png"), $("#golden_ticket_step2").attr("src", "https://sirv.freebitco.in/1572662569_agbRyLNe.png"), $("#golden_ticket_step3").attr("src", "https://sirv.freebitco.in/1572662587_p5nWnSmz.png")), "stats" != e && "rewards" != e && "golden_ticket" != e && "betting" != e && "lottery" != e || InitialStatsLoad(), "wager_promotion" == e && PreviousContestWinners(wagering_contest_winners_round_display), "lottery" == e && PreviousLotteryWinners(lottery_winners_round_display), "fun_savings" == e && ($(".page_tabs").hide(), $("#loyalty_token_tab").show(), $(".tabs li").removeClass("active"), $(".loyalty_token_link").parent().addClass("active"), current_page_tab = "loyalty_token", $("#fun_savings_modal").foundation("reveal", "open")), "fun_buy_lock" == e && ($(".page_tabs").hide(), $("#loyalty_token_tab").show(), $(".tabs li").removeClass("active"), $(".loyalty_token_link").parent().addClass("active"), current_page_tab = "loyalty_token", UpdateFunPrice(), $("#buy_fun_modal").foundation("reveal", "open"))
}

function insertBitcoinMore(e, t) {
    document.getElementById(e).insertAdjacentHTML(t, '<div class ="row"><div class="large-12 small-12 large-centered small-centered columns" style="text-align:center;"></div></div><p class="faq_question bold">What is Bitcoin?</p><div class="faq_answer"><p>Bitcoin is an innovative payment network and a new kind of money.</p><p>Bitcoin uses peer-to-peer technology to operate with no central authority or banks; managing transactions and the issuing of bitcoins is carried out collectively by the network. <b>Bitcoin is open-source; its design is public, nobody owns or controls Bitcoin and everyone can take part.</b> Through many of its unique properties, Bitcoin allows exciting uses that could not be covered by any previous payment system.</p></div><p class="faq_question bold">How does Bitcoin work?</p><div class="faq_answer"><p>From a user perspective, Bitcoin is nothing more than a mobile app or computer program that provides a personal Bitcoin wallet and allows a user to send and receive bitcoins with them. This is how Bitcoin works for most users.</p><p>Behind the scenes, the Bitcoin network is sharing a public ledger called the "block chain". This ledger contains every transaction ever processed, allowing a user&rsquo;s computer to verify the validity of each transaction. The authenticity of each transaction is protected by digital signatures corresponding to the sending addresses, allowing all users to have full control over sending bitcoins from their own Bitcoin addresses. In addition, anyone can process transactions using the computing power of specialized hardware and earn a reward in bitcoins for this service. This is often called "mining". To learn more about Bitcoin, you can consult the dedicated page and the original paper.</p></div><p class="faq_question bold">Who created Bitcoin?</p><div class="faq_answer"><p>Bitcoin is the first implementation of a concept called "cryptocurrency", which was first described in 1998 by Wei Dai on the cypherpunks mailing list, suggesting the idea of a new form of money that uses cryptography to control its creation and transactions, rather than a central authority. The first Bitcoin specification and proof of concept was published in 2009 in a cryptography mailing list by Satoshi Nakamoto. Satoshi left the project in late 2010 without revealing much about himself. The community has since grown exponentially with many developers working on Bitcoin.</p><p>Satoshi&rsquo;s anonymity often raised unjustified concerns, many of which are linked to misunderstanding of the open-source nature of Bitcoin. The Bitcoin protocol and software are published openly and any developer around the world can review the code or make their own modified version of the Bitcoin software. Just like current developers, Satoshi&rsquo;s influence was limited to the changes he made being adopted by others and therefore he did not control Bitcoin. As such, the identity of Bitcoin&rsquo;s inventor is probably as relevant today as the identity of the person who invented paper.</p></div><p class="faq_question bold">Who controls the Bitcoin network?</p><div class="faq_answer"><p>Nobody owns the Bitcoin network much like no one owns the technology behind email. Bitcoin is controlled by all Bitcoin users around the world. While developers are improving the software, they can&rsquo;t force a change in the Bitcoin protocol because all users are free to choose what software and version they use. In order to stay compatible with each other, all users need to use software complying with the same rules. Bitcoin can only work correctly with a complete consensus among all users. Therefore, all users and developers have a strong incentive to protect this consensus.</p></div><p class="faq_question bold">Is Bitcoin really used by people?</p><div class="faq_answer"><p>Yes. There is a growing number of businesses and individuals using Bitcoin. This includes brick and mortar businesses like restaurants, apartments, law firms, and popular online services such as Namecheap, WordPress, and Reddit. While Bitcoin remains a relatively new phenomenon, it is growing fast. At the end of August 2013, the value of all bitcoins in circulation exceeded US$ 1.5 billion with millions of dollars worth of bitcoins exchanged daily.</p></div><p class="faq_question bold">How does one acquire bitcoins?</p><div class="faq_answer"><p><ul style="text-align:left;"><li>As payment for goods or services.</li><li>Purchase bitcoins at a Bitcoin exchange.</li><li>Exchange bitcoins with someone near you.</li><li>Earn bitcoins through competitive mining.</li></ul></p><p>While it may be possible to find individuals who wish to sell bitcoins in exchange for a credit card or PayPal payment, most exchanges do not allow funding via these payment methods. This is due to cases where someone buys bitcoins with PayPal, and then reverses their half of the transaction. This is commonly referred to as a chargeback.</p></div><p class="faq_question bold">How difficult is it to make a Bitcoin payment?</p><div class="faq_answer"><p>Bitcoin payments are easier to make than debit or credit card purchases, and can be received without a merchant account. Payments are made from a wallet application, either on your computer or smartphone, by entering the recipient&rsquo;s address, the payment amount, and pressing send. To make it easier to enter a recipient&rsquo;s address, many <a href="https://freebitco.in/site/bitcoin-wallet/" target="blank">Bitcoin wallets</a> can obtain the address by scanning a QR code or touching two phones together with NFC technology.</p></div><p class="faq_question bold">What are the advantages of Bitcoin?</p><div class="faq_answer"><p><ul style="text-align:left;"><li>Payment freedom - It is possible to send and receive any amount of money instantly anywhere in the world at any time. No bank holidays. No borders. No imposed limits. Bitcoin allows its users to be in full control of their money.</li><li>Very low fees - Bitcoin payments are currently processed with either no fees or extremely small fees. Users may include fees with transactions to receive priority processing, which results in faster confirmation of transactions by the network. Additionally, merchant processors exist to assist merchants in processing transactions, converting bitcoins to fiat currency and depositing funds directly into merchants&rsquo; bank accounts daily. As these services are based on Bitcoin, they can be offered for much lower fees than with PayPal or credit card networks.</li><li>Fewer risks for merchants - Bitcoin transactions are secure, irreversible, and do not contain customers sensitive or personal information. This protects merchants from losses caused by fraud or fraudulent chargebacks, and there is no need for PCI compliance. Merchants can easily expand to new markets where either credit cards are not available or fraud rates are unacceptably high. The net results are lower fees, larger markets, and fewer administrative costs.</li><li>Security and control - Bitcoin users are in full control of their transactions; it is impossible for merchants to force unwanted or unnoticed charges as can happen with other payment methods. Bitcoin payments can be made without personal information tied to the transaction. This offers strong protection against identity theft. Bitcoin users can also protect their money with backup and encryption.</li><li>Transparent and neutral - All information concerning the Bitcoin money supply itself is readily available on the block chain for anybody to verify and use in real-time. No individual or organization can control or manipulate the Bitcoin protocol because it is cryptographically secure. This allows the core of Bitcoin to be trusted for being completely neutral, transparent and predictable.</li></ul></p></div><p class="faq_question bold">What are the disadvantages of Bitcoin?</p><div class="faq_answer"><p><ul style="text-align:left;"><li>Degree of acceptance - Many people are still unaware of Bitcoin. Every day, more businesses accept bitcoins because they want the advantages of doing so, but the list remains small and still needs to grow in order to benefit from network effects.</li><li>Volatility - The total value of bitcoins in circulation and the number of businesses using Bitcoin are still very small compared to what they could be. Therefore, relatively small events, trades, or business activities can significantly affect the price. In theory, this volatility will decrease as Bitcoin markets and the technology matures. Never before has the world seen a start-up currency, so it is truly difficult (and exciting) to imagine how it will play out.</li><li>Ongoing development - Bitcoin software is still in beta with many incomplete features in active development. New tools, features, and services are being developed to make Bitcoin more secure and accessible to the masses. Some of these are still not ready for everyone. Most Bitcoin businesses are new and still offer no insurance. In general, Bitcoin is still in the process of maturing.</li></ul></p></div><p class="faq_question bold">Why do people trust Bitcoin?</p><div class="faq_answer"><p>Much of the trust in Bitcoin comes from the fact that it requires no trust at all. Bitcoin is fully open-source and decentralized. This means that anyone has access to the entire source code at any time. Any developer in the world can therefore verify exactly how Bitcoin works. All transactions and bitcoins issued into existence can be transparently consulted in real-time by anyone. All payments can be made without reliance on a third party and the whole system is protected by heavily peer-reviewed cryptographic algorithms like those used for online banking. No organization or individual can control Bitcoin, and the network remains secure even if not all of its users can be trusted.</p></div><p class="faq_question bold">Can I make money with Bitcoin?</p><div class="faq_answer"><p>You should never expect to get rich with Bitcoin or any emerging technology. It is always important to be wary of anything that sounds too good to be true or disobeys basic economic rules.</p><p>Bitcoin is a growing space of innovation and there are business opportunities that also include risks. There is no guarantee that Bitcoin will continue to grow even though it has developed at a very fast rate so far. Investing time and resources on anything related to Bitcoin requires entrepreneurship. There are various ways to make money with Bitcoin such as mining, speculation or running new businesses. All of these methods are competitive and there is no guarantee of profit. It is up to each individual to make a proper evaluation of the costs and the risks involved in any such project.</p></div><p class="faq_question bold">Is Bitcoin fully virtual and immaterial?</p><div class="faq_answer"><p>Bitcoin is as virtual as the credit cards and online banking networks people use everyday. Bitcoin can be used to pay online and in physical stores just like any other form of money. Bitcoins can also be exchanged in physical form such as the Casascius coins, but paying with a mobile phone usually remains more convenient. Bitcoin balances are stored in a large distributed network, and they cannot be fraudulently altered by anybody. In other words, Bitcoin users have exclusive control over their funds and bitcoins cannot vanish just because they are virtual.</p></div><p class="faq_question bold">Is Bitcoin anonymous?</p><div class="faq_answer"><p>Bitcoin is designed to allow its users to send and receive payments with an acceptable level of privacy as well as any other form of money. However, Bitcoin is not anonymous and cannot offer the same level of privacy as cash. The use of Bitcoin leaves extensive public records. Various mechanisms exist to protect users&rsquo; privacy, and more are in development. However, there is still work to be done before these features are used correctly by most Bitcoin users.</p><p>Some concerns have been raised that private transactions could be used for illegal purposes with Bitcoin. However, it is worth noting that Bitcoin will undoubtedly be subjected to similar regulations that are already in place inside existing financial systems. Bitcoin cannot be more anonymous than cash and it is not likely to prevent criminal investigations from being conducted. Additionally, Bitcoin is also designed to prevent a large range of financial crimes.</p></div><p class="faq_question bold">What happens when bitcoins are lost?</p><div class="faq_answer"><p>When a user loses his wallet, it has the effect of removing money out of circulation. Lost bitcoins still remain in the block chain just like any other bitcoins. However, lost bitcoins remain dormant forever because there is no way for anybody to find the private key(s) that would allow them to be spent again. Because of the law of supply and demand, when fewer bitcoins are available, the ones that are left will be in higher demand and increase in value to compensate.</p></div><p class="faq_question bold">Can Bitcoin scale to become a major payment network?</p><div class="faq_answer"><p>The Bitcoin network can already process a much higher number of transactions per second than it does today. It is, however, not entirely ready to scale to the level of major credit card networks. Work is underway to lift current limitations, and future requirements are well known. Since inception, every aspect of the Bitcoin network has been in a continuous process of maturation, optimization, and specialization, and it should be expected to remain that way for some years to come. As traffic grows, more Bitcoin users may use lightweight clients, and full network nodes may become a more specialized service. For more details, see the Scalability page on the Wiki.</p></div><p class="faq_question bold">Is Bitcoin legal?</p><div class="faq_answer"><p>To the best of our knowledge, Bitcoin has not been made illegal by legislation in most jurisdictions. However, some jurisdictions (such as Argentina and Russia) severely restrict or ban foreign currencies. Other jurisdictions (such as Thailand) may limit the licensing of certain entities such as Bitcoin exchanges.</p><p>Regulators from various jurisdictions are taking steps to provide individuals and businesses with rules on how to integrate this new technology with the formal, regulated financial system. For example, the Financial Crimes Enforcement Network (FinCEN), a bureau in the United States Treasury Department, issued non-binding guidance on how it characterizes certain activities involving virtual currencies.</p></div><p class="faq_question bold">Is Bitcoin useful for illegal activities?</p><div class="faq_answer"><p>Bitcoin is money, and money has always been used both for legal and illegal purposes. Cash, credit cards and current banking systems widely surpass Bitcoin in terms of their use to finance crime. Bitcoin can bring significant innovation in payment systems and the benefits of such innovation are often considered to be far beyond their potential drawbacks.</p><p>Bitcoin is designed to be a huge step forward in making money more secure and could also act as a significant protection against many forms of financial crime. For instance, bitcoins are completely impossible to counterfeit. Users are in full control of their payments and cannot receive unapproved charges such as with credit card fraud. Bitcoin transactions are irreversible and immune to fraudulent chargebacks. Bitcoin allows money to be secured against theft and loss using very strong and useful mechanisms such as backups, encryption, and multiple signatures.</p><p>Some concerns have been raised that Bitcoin could be more attractive to criminals because it can be used to make private and irreversible payments. However, these features already exist with cash and wire transfer, which are widely used and well-established. The use of Bitcoin will undoubtedly be subjected to similar regulations that are already in place inside existing financial systems, and Bitcoin is not likely to prevent criminal investigations from being conducted. In general, it is common for important breakthroughs to be perceived as being controversial before their benefits are well understood. The Internet is a good example among many others to illustrate this.</p></div><p class="faq_question bold">Can Bitcoin be regulated?</p><div class="faq_answer"><p>The Bitcoin protocol itself cannot be modified without the cooperation of nearly all its users, who choose what software they use. Attempting to assign special rights to a local authority in the rules of the global Bitcoin network is not a practical possibility. Any rich organization could choose to invest in mining hardware to control half of the computing power of the network and become able to block or reverse recent transactions. However, there is no guarantee that they could retain this power since this requires to invest as much than all other miners in the world.</p><p>It is however possible to regulate the use of Bitcoin in a similar way to any other instrument. Just like the dollar, Bitcoin can be used for a wide variety of purposes, some of which can be considered legitimate or not as per each jurisdiction&rsquo;s laws. In this regard, Bitcoin is no different than any other tool or resource and can be subjected to different regulations in each country. Bitcoin use could also be made difficult by restrictive regulations, in which case it is hard to determine what percentage of users would keep using the technology. A government that chooses to ban Bitcoin would prevent domestic businesses and markets from developing, shifting innovation to other countries. The challenge for regulators, as always, is to develop efficient solutions while not impairing the growth of new emerging markets and businesses.</p></div><p class="faq_question bold">What about Bitcoin and taxes?</p><div class="faq_answer"><p>Bitcoin is not a fiat currency with legal tender status in any jurisdiction, but often tax liability accrues regardless of the medium used. There is a wide variety of legislation in many different jurisdictions which could cause income, sales, payroll, capital gains, or some other form of tax liability to arise with Bitcoin.</p></div><p class="faq_question bold">What about Bitcoin and consumer protection?</p><div class="faq_answer"><p>Bitcoin is freeing people to transact on their own terms. Each user can send and receive payments in a similar way to cash but they can also take part in more complex contracts. Multiple signatures allow a transaction to be accepted by the network only if a certain number of a defined group of persons agree to sign the transaction. This allows innovative dispute mediation services to be developed in the future. Such services could allow a third party to approve or reject a transaction in case of disagreement between the other parties without having control on their money. As opposed to cash and other payment methods, Bitcoin always leaves a public proof that a transaction did take place, which can potentially be used in a recourse against businesses with fraudulent practices.</p><p>It is also worth noting that while merchants usually depend on their public reputation to remain in business and pay their employees, they don&rsquo;t have access to the same level of information when dealing with new consumers. The way Bitcoin works allows both individuals and businesses to be protected against fraudulent chargebacks while giving the choice to the consumer to ask for more protection when they are not willing to trust a particular merchant.</p></div><p class="faq_question bold">How are bitcoins created?</p><div class="faq_answer"><p>New bitcoins are generated by a competitive and decentralized process called "mining". This process involves that individuals are rewarded by the network for their services. Bitcoin miners are processing transactions and securing the network using specialized hardware and are collecting new bitcoins in exchange.</p><p>The Bitcoin protocol is designed in such a way that new bitcoins are created at a fixed rate. This makes Bitcoin mining a very competitive business. When more miners join the network, it becomes increasingly difficult to make a profit and miners must seek efficiency to cut their operating costs. No central authority or developer has any power to control or manipulate the system to increase their profits. Every Bitcoin node in the world will reject anything that does not comply with the rules it expects the system to follow.</p><p>Bitcoins are created at a decreasing and predictable rate. The number of new bitcoins created each year is automatically halved over time until bitcoin issuance halts completely with a total of 21 million bitcoins in existence. At this point, Bitcoin miners will probably be supported exclusively by numerous small transaction fees.</p></div><p class="faq_question bold">Why do bitcoins have value?</p><div class="faq_answer"><p>Bitcoins have value because they are useful as a form of money. Bitcoin has the characteristics of money (durability, portability, fungibility, scarcity, divisibility, and recognizability) based on the properties of mathematics rather than relying on physical properties (like gold and silver) or trust in central authorities (like fiat currencies). In short, Bitcoin is backed by mathematics. With these attributes, all that is required for a form of money to hold value is trust and adoption. In the case of Bitcoin, this can be measured by its growing base of users, merchants, and startups. As with all currency, bitcoin&rsquo;s value comes only and directly from people willing to accept them as payment.</p></div><p class="faq_question bold">What determines bitcoin&rsquo;s price?</p><div class="faq_answer"><p>The price of a bitcoin is determined by supply and demand. When demand for bitcoins increases, the <a href="https://freebitco.in/site/bitcoin/" target="blank">Bitcoin price</a> increases, and when demand falls, the price falls. There is only a limited number of bitcoins in circulation and new bitcoins are created at a predictable and decreasing rate, which means that demand must follow this level of inflation to keep the price stable. Because Bitcoin is still a relatively small market compared to what it could be, it doesn&rsquo;t take significant amounts of money to move the market price up or down, and thus the price of a bitcoin is still very volatile.</p></div><p class="faq_question bold">Can bitcoins become worthless?</p><div class="faq_answer"><p>Yes. History is littered with currencies that failed and are no longer used, such as the German Mark during the Weimar Republic and, more recently, the Zimbabwean dollar. Although previous currency failures were typically due to hyperinflation of a kind that Bitcoin makes impossible, there is always potential for technical failures, competing currencies, political issues and so on. As a basic rule of thumb, no currency should be considered absolutely safe from failures or hard times. Bitcoin has proven reliable for years since its inception and there is a lot of potential for Bitcoin to continue to grow. However, no one is in a position to predict what the future will be for Bitcoin.</p></div><p class="faq_question bold">Is Bitcoin a bubble?</p><div class="faq_answer"><p>A fast rise in price does not constitute a bubble. An artificial over-valuation that will lead to a sudden downward correction constitutes a bubble. Choices based on individual human action by hundreds of thousands of market participants is the cause for bitcoin&rsquo;s price to fluctuate as the market seeks price discovery. Reasons for changes in sentiment may include a loss of confidence in Bitcoin, a large difference between value and price not based on the fundamentals of the Bitcoin economy, increased press coverage stimulating speculative demand, fear of uncertainty, and old-fashioned irrational exuberance and greed.</p></div><p class="faq_question bold">Is Bitcoin a Ponzi scheme?</p><div class="faq_answer"><p>A Ponzi scheme is a fraudulent investment operation that pays returns to its investors from their own money, or the money paid by subsequent investors, instead of from profit earned by the individuals running the business. Ponzi schemes are designed to collapse at the expense of the last investors when there is not enough new participants.</p><p>Bitcoin is a free software project with no central authority. Consequently, no one is in a position to make fraudulent representations about investment returns. Like other major currencies such as gold, United States dollar, euro, yen, etc. there is no guaranteed purchasing power and the exchange rate floats freely. This leads to volatility where owners of bitcoins can unpredictably make or lose money. Beyond speculation, Bitcoin is also a payment system with useful and competitive attributes that are being used by thousands of users and businesses.</p></div><p class="faq_question bold">Doesn&rsquo;t Bitcoin unfairly benefit early adopters?</p><div class="faq_answer"><p>Some early adopters have large numbers of bitcoins because they took risks and invested time and resources in an unproven technology that was hardly used by anyone and that was much harder to secure properly. Many early adopters spent large numbers of bitcoins quite a few times before they became valuable or bought only small amounts and didn&rsquo;t make huge gains. There is no guarantee that the price of a bitcoin will increase or drop. This is very similar to investing in an early startup that can either gain value through its usefulness and popularity, or just never break through. Bitcoin is still in its infancy, and it has been designed with a very long-term view; it is hard to imagine how it could be less biased towards early adopters, and today&rsquo;s users may or may not be the early adopters of tomorrow.</p></div><p class="faq_question bold">Won&rsquo;t the finite amount of bitcoins be a limitation?</p><div class="faq_answer"><p>Bitcoin is unique in that only 21 million bitcoins will ever be created. However, this will never be a limitation because transactions can be denominated in smaller sub-units of a bitcoin, such as bits - there are 1,000,000 bits in 1 bitcoin. Bitcoins can be divided up to 8 decimal places (0.000 000 01) and potentially even smaller units if that is ever required in the future as the average transaction size decreases.</p></div><p class="faq_question bold">Won&rsquo;t Bitcoin fall in a deflationary spiral?</p><div class="faq_answer"><p>The deflationary spiral theory says that if prices are expected to fall, people will move purchases into the future in order to benefit from the lower prices. That fall in demand will in turn cause merchants to lower their prices to try and stimulate demand, making the problem worse and leading to an economic depression.</p><p>Although this theory is a popular way to justify inflation amongst central bankers, it does not appear to always hold true and is considered controversial amongst economists. Consumer electronics is one example of a market where prices constantly fall but which is not in depression. Similarly, the value of bitcoins has risen over time and yet the size of the Bitcoin economy has also grown dramatically along with it. Because both the value of the currency and the size of its economy started at zero in 2009, Bitcoin is a counterexample to the theory showing that it must sometimes be wrong.</p><p>Notwithstanding this, Bitcoin is not designed to be a deflationary currency. It is more accurate to say Bitcoin is intended to inflate in its early years, and become stable in its later years. The only time the quantity of bitcoins in circulation will drop is if people carelessly lose their wallets by failing to make backups. With a stable monetary base and a stable economy, the value of the currency should remain the same.</p></div><p class="faq_question bold">Isn&rsquo;t speculation and volatility a problem for Bitcoin?</p><div class="faq_answer"><p>This is a chicken and egg situation. For bitcoin&rsquo;s price to stabilize, a large scale economy needs to develop with more businesses and users. For a large scale economy to develop, businesses and users will seek for price stability.</p><p>Fortunately, volatility does not affect the main benefits of Bitcoin as a payment system to transfer money from point A to point B. It is possible for businesses to convert bitcoin payments to their local currency instantly, allowing them to profit from the advantages of Bitcoin without being subjected to price fluctuations. Since Bitcoin offers many useful and unique features and properties, many users choose to use Bitcoin. With such solutions and incentives, it is possible that Bitcoin will mature and develop to a degree where price volatility will become limited.</p></div><p class="faq_question bold">What if someone bought up all the existing bitcoins?</p><div class="faq_answer"><p>Only a fraction of bitcoins issued to date are found on the exchange markets for sale. Bitcoin markets are competitive, meaning the price of a bitcoin will rise or fall depending on supply and demand. Additionally, new bitcoins will continue to be issued for decades to come. Therefore even the most determined buyer could not buy all the bitcoins in existence. This situation isn&rsquo;t to suggest, however, that the markets aren&rsquo;t vulnerable to price manipulation; it still doesn&rsquo;t take significant amounts of money to move the market price up or down, and thus Bitcoin remains a volatile asset thus far.</p></div><p class="faq_question bold">What if someone creates a better digital currency?</p><div class="faq_answer"><p>That can happen. For now, Bitcoin remains by far the most popular decentralized virtual currency, but there can be no guarantee that it will retain that position. There is already a set of alternative currencies inspired by Bitcoin. It is however probably correct to assume that significant improvements would be required for a new currency to overtake Bitcoin in terms of established market, even though this remains unpredictable. Bitcoin could also conceivably adopt improvements of a competing currency so long as it doesn&rsquo;t change fundamental parts of the protocol.</p></div><p class="faq_question bold">What is Bitcoin mining?</p><div class="faq_answer"><p>Mining is the process of spending computing power to process transactions, secure the network, and keep everyone in the system synchronized together. It can be perceived like the Bitcoin data center except that it has been designed to be fully decentralized with miners operating in all countries and no individual having control over the network. This process is referred to as "mining" as an analogy to gold mining because it is also a temporary mechanism used to issue new bitcoins. Unlike gold mining, however, Bitcoin mining provides a reward in exchange for useful services required to operate a secure payment network. Mining will still be required after the last bitcoin is issued.</p></div><p class="faq_question bold">How does Bitcoin mining work?</p><div class="faq_answer"><p>Anybody can become a Bitcoin miner by running software with specialized hardware. Mining software listens for transactions broadcast through the peer-to-peer network and performs appropriate tasks to process and confirm these transactions. Bitcoin miners perform this work because they can earn transaction fees paid by users for faster transaction processing, and newly created bitcoins issued into existence according to a fixed formula.</p><p>For new transactions to be confirmed, they need to be included in a block along with a mathematical proof of work. Such proofs are very hard to generate because there is no way to create them other than by trying billions of calculations per second. This requires miners to perform these calculations before their blocks are accepted by the network and before they are rewarded. As more people start to mine, the difficulty of finding valid blocks is automatically increased by the network to ensure that the average time to find a block remains equal to 10 minutes. As a result, mining is a very competitive business where no individual miner can control what is included in the block chain.</p><p>The proof of work is also designed to depend on the previous block to force a chronological order in the block chain. This makes it exponentially difficult to reverse previous transactions because this requires the recalculation of the proofs of work of all the subsequent blocks. When two blocks are found at the same time, miners work on the first block they receive and switch to the longest chain of blocks as soon as the next block is found. This allows mining to secure and maintain a global consensus based on processing power.</p><p>Bitcoin miners are neither able to cheat by increasing their own reward nor process fraudulent transactions that could corrupt the Bitcoin network because all Bitcoin nodes would reject any block that contains invalid data as per the rules of the Bitcoin protocol. Consequently, the network remains secure even if not all Bitcoin miners can be trusted.</p></div><p class="faq_question bold">Isn&rsquo;t Bitcoin mining a waste of energy?</p><div class="faq_answer"><p>Spending energy to secure and operate a payment system is hardly a waste. Like any other payment service, the use of Bitcoin entails processing costs. Services necessary for the operation of currently widespread monetary systems, such as banks, credit cards, and armored vehicles, also use a lot of energy. Although unlike Bitcoin, their total energy consumption is not transparent and cannot be as easily measured.</p><p>Bitcoin mining has been designed to become more optimized over time with specialized hardware consuming less energy, and the operating costs of mining should continue to be proportional to demand. When Bitcoin mining becomes too competitive and less profitable, some miners choose to stop their activities. Furthermore, all energy expended mining is eventually transformed into heat, and the most profitable miners will be those who have put this heat to good use. An optimally efficient mining network is one that isn&rsquo;t actually consuming any extra energy. While this is an ideal, the economics of mining are such that miners individually strive toward it.</p></div><p class="faq_question bold">How does mining help secure Bitcoin?</p><div class="faq_answer"><p>Mining creates the equivalent of a competitive lottery that makes it very difficult for anyone to consecutively add new blocks of transactions into the block chain. This protects the neutrality of the network by preventing any individual from gaining the power to block certain transactions. This also prevents any individual from replacing parts of the block chain to roll back their own spends, which could be used to defraud other users. Mining makes it exponentially more difficult to reverse a past transaction by requiring the rewriting of all blocks following this transaction.</p></div><p class="faq_question bold">What do I need to start mining?</p><div class="faq_answer"><p>In the early days of Bitcoin, anyone could find a new block using their computer&rsquo;s CPU. As more and more people started mining, the difficulty of finding new blocks increased greatly to the point where the only cost-effective method of mining today is using specialized hardware. You can visit BitcoinMining.com for more information.</p></div><p class="faq_question bold">Is Bitcoin secure?</p><div class="faq_answer"><p>The Bitcoin technology - the protocol and the cryptography - has a strong security track record, and the Bitcoin network is probably the biggest distributed computing project in the world. Bitcoin&rsquo;s most common vulnerability is in user error. Bitcoin wallet files that store the necessary private keys can be accidentally deleted, lost or stolen. This is pretty similar to physical cash stored in a digital form. Fortunately, users can employ sound security practices to protect their money or use service providers that offer good levels of security and insurance against theft or loss.</p></div><p class="faq_question bold">Hasn&rsquo;t Bitcoin been hacked in the past?</p><div class="faq_answer"><p>The rules of the protocol and the cryptography used for Bitcoin are still working years after its inception, which is a good indication that the concept is well designed. However, security flaws have been found and fixed over time in various software implementations. Like any other form of software, the security of Bitcoin software depends on the speed with which problems are found and fixed. The more such issues are discovered, the more Bitcoin is gaining maturity.</p><p>There are often misconceptions about thefts and security breaches that happened on diverse exchanges and businesses. Although these events are unfortunate, none of them involve Bitcoin itself being hacked, nor imply inherent flaws in Bitcoin; just like a bank robbery doesn&rsquo;t mean that the dollar is compromised. However, it is accurate to say that a complete set of good practices and intuitive security solutions is needed to give users better protection of their money, and to reduce the general risk of theft and loss. Over the course of the last few years, such security features have quickly developed, such as wallet encryption, offline wallets, hardware wallets, and multi-signature transactions.</p></div><p class="faq_question bold">Could users collude against Bitcoin?</p><div class="faq_answer"><p>It is not possible to change the Bitcoin protocol that easily. Any Bitcoin client that doesn&rsquo;t comply with the same rules cannot enforce their own rules on other users. As per the current specification, double spending is not possible on the same block chain, and neither is spending bitcoins without a valid signature. Therefore, It is not possible to generate uncontrolled amounts of bitcoins out of thin air, spend other users&rsquo; funds, corrupt the network, or anything similar.</p><p>However, powerful miners could arbitrarily choose to block or reverse recent transactions. A majority of users can also put pressure for some changes to be adopted. Because Bitcoin only works correctly with a complete consensus between all users, changing the protocol can be very difficult and requires an overwhelming majority of users to adopt the changes in such a way that remaining users have nearly no choice but to follow. As a general rule, it is hard to imagine why any Bitcoin user would choose to adopt any change that could compromise their own money.</p></div><p class="faq_question bold">Is Bitcoin vulnerable to quantum computing?</p><div class="faq_answer"><p>Yes, most systems relying on cryptography in general are, including traditional banking systems. However, quantum computers don&rsquo;t yet exist and probably won&rsquo;t for a while. In the event that quantum computing could be an imminent threat to Bitcoin, the protocol could be upgraded to use post-quantum algorithms. Given the importance that this update would have, it can be safely expected that it would be highly reviewed by developers and adopted by all Bitcoin users.</p></div><p class="faq_question bold">What if I have more questions about Bitcoin?</p><div class="faq_answer"><p>Three great places where you can get your questions answered are the BitcoinTalk Forum at <a href="http://bitcointalk.org" target="_blank">BitcoinTalk.org</a> and Bitcoin Stack Exchange at <a href="http://bitcoin.stackexchange.com/" target="_blank">Bitcoin.StackExchange.com</a>.</p></div>')
}

function insertIntoBetHistory(e, t, a, o, n, i, s, r, l, _, c, d, u, p, b, m, h, f) {
    if ("w" === e ? t = "<font color=green>" + t + "</font>" : "l" === e && (t = "<font color=red>-" + t + "</font>"), l = l.toUpperCase(), "0" == _) _ = "&#x2716";
    else if (_) {
        for (var g = _.split(","), y = "", w = 0; w < g.length; w++) y = y + jackpot_costs[g[w]] + " | ";
        _ = "<span data-tooltip class='has-tip' title='" + (y = y.slice(0, -3)) + "' style='cursor:pointer;'>&#x2714</span>"
    } else _ = "&nbsp;";
    "" == l && (l = "&nbsp;"), $("div.multiply_bet_history_table_row").length >= 20 && $("div.multiply_bet_history_table_row").last().remove();
    var v = formatDate();
    h && (v = h);
    var k = "BAB",
        x = "BAA",
        C = "Bonus Account Balance Before Bet",
        B = "Bonus Account Balance After Bet";
    "lot" == f ? (k = "LTB", x = "LTA", C = "Lottery Tickets Before", B = "Lottery Tickets After") : "rp" == f ? (k = "RPB", x = "RPA", C = "Reward Points Before", B = "Reward Points After") : "gt" == f && (k = "GTB", x = "GTA", C = "Golden Tickets Before", B = "Golden Tickets After");
    var T = v.split(" "),
        F = '<div class="multiply_bet_history_table_row"><div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-2 small-2 columns center lottery_winner_table_box lottery_winner_table_first_last_cell"><i class="show_balance_before_after fa fa-arrows-alt" aria-hidden="true"></i>' + T[1] + '</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_second_cell">' + r + '</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_second_cell">' + l + '</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_second_cell">' + a + '</div><div class="large-2 small-2 columns center lottery_winner_table_box lottery_winner_table_second_cell">' + c + '</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_second_cell">' + d + '</div><div class="large-2 small-2 columns center lottery_winner_table_box lottery_winner_table_second_cell">' + t + '</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_third_cell">' + _ + '</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_first_last_cell"><a href="https://s3.amazonaws.com/roll-verifier/verify.html?server_seed=' + o + "&client_seed=" + n + "&server_seed_hash=" + i + "&nonce=" + s + '" target=_blank>CLICK</a></div></div><div class="balance_before_after" class="large-12 small-12 columns center lottery_winner_table_box_container effect2" style="display: none;"><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_first_last_cell bb_background" style="font-weight: bold;">BB&nbsp; &nbsp;<i class="fa fa-info-circle" aria-hidden="true" title="Account Balance Before Bet"></i><span class="arrow-up balance_after_bet_span_1"></span><span class="arrow-up-small balance_after_bet_span_2"></span></div><div class="large-2 small-2 columns center lottery_winner_table_box balance_after_bet_column bb_background">' + u + '</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_first_last_cell bb_background" style="font-weight: bold;">BA&nbsp; &nbsp;<i class="fa fa-info-circle" aria-hidden="true" title="Account Balance After Bet"></i><span class="arrow-up balance_after_bet_span_1"></span><span class="arrow-up-small balance_after_bet_span_2"></span></div><div class="large-2 small-2 columns center lottery_winner_table_box balance_after_bet_column bb_background">' + p + '</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_first_last_cell bb_background" style="font-weight: bold;">' + k + '&nbsp;<i class="fa fa-info-circle" aria-hidden="true" title="' + C + '"></i><span class="arrow-up balance_after_bet_span_1"></span><span class="arrow-up-small balance_after_bet_span_2"></span></div><div class="large-2 small-2 columns center lottery_winner_table_box balance_after_bet_column bb_background">' + b + '</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_first_last_cell bb_background" style="font-weight: bold;">' + x + '&nbsp;<i class="fa fa-info-circle" aria-hidden="true" title="' + B + '"></i><span class="arrow-up balance_after_bet_span_1"></span><span class="arrow-up-small balance_after_bet_span_2"></span></div><div class="large-2 small-2 columns center lottery_winner_table_box balance_after_bet_last_column bb_background">' + m + "</div></div></div>",
        S = T[0].replace(/\//g, "_");
    return 0 == $("#multiply_history_date_row_" + S).length ? (F = '<div class="large-12 small-12 columns center lottery_winner_table_box" id="multiply_history_date_row_' + S + '"><div class="center" style="margin:auto; font-weight:bold;">DATE: ' + T[0] + '</div></div> <div class="large-12 small-12 columns center lottery_winner_table_box_container effect2 multiply_history_table_header"><div class="large-2 small-2 columns center lottery_winner_table_box lottery_winner_table_first_last_cell font_bold">TIME</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_second_cell font_bold">GAME</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_second_cell font_bold">BET</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_second_cell font_bold">ROLL</div><div class="large-2 small-2 columns center lottery_winner_table_box lottery_winner_table_second_cell font_bold">STAKE</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_second_cell font_bold"><span data-tooltip class="has-tip" title="Multiplier">MULT</span></div><div class="large-2 small-2 columns center lottery_winner_table_box lottery_winner_table_second_cell font_bold">PROFIT</div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_third_cell font_bold"><span data-tooltip class="has-tip" title="Jackpot">JPOT</span></div><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_first_last_cell font_bold"><span data-tooltip class="has-tip" title="Verify">VER</span></div></div>' + F, $("#bet_history_table_rows").prepend(F)) : $("#multiply_history_date_row_" + S).next("div.multiply_history_table_header").after(F), !1
}

function VisitLink(e) {
    "none" != e && window.open(e)
}

function RedeemRPProduct(e) {
    $(".reward_link_redeem_button_style").attr("disabled", !0), $(".orange_button").attr("disabled", !0);
    var t = $("#encash_points_number").val(),
        a = $("#rp_wof_tix_no").val();
    $.get("/?op=redeem_rewards&id=" + e + "&points=" + t + "&tickets=" + a, (function(e) {
        var t, a = e.split(":");
        if ("s" == a[0])
            if ($(".user_reward_points").html(a[2]), "s1" == a[1]) $("#balance").html(a[5]), balanceChanged(), t = "Successfully converted " + ReplaceNumberWithCommas(parseInt(a[3])) + " points to " + parseFloat(parseInt(a[4]) / 1e8).toFixed(8) + "BTC.";
            else if ("s2" == a[1]) {
            t = "Your bonus has been succesfully activated!";
            var o = '<p>Active bonus <span class="free_play_bonus_box_span_large">' + a[5] + '</span> ends in <span class="free_play_bonus_box_span_large" id="bonus_span_' + a[3] + '"></span></p>';
            $("#bonus_container_" + a[3]).length > 0 ? $("#bonus_container_" + a[3]).html(o) : $("#reward_points_bonuses_main_div").append('<div class="bold center free_play_bonus_box_large" id="bonus_container_' + a[3] + '">' + o + "</div>"), $("#bonus_container_" + a[3]).show(), BonusEndCountdown(a[3], parseInt(a[4])), "fp_bonus" == a[3] && $("#fp_min_reward").html(a[6] + " BTC")
        } else "s3" == a[1] ? t = "Your redemption request for " + a[3] + " has been sent succesfully. We shall contact you via email for your shipping details (if required). If you do not have an email address added to your account, please add it now via the PROFILE page." : "s4" == a[1] && (t = "You have succesfully exchanged " + a[4] + " RP for " + a[3] + " WOF tickets.<BR>You may play these in the new window that will open automatically.", window.open("https://freebitco.in/static/html/wof/wof-premium.html"));
        else "e" == a[0] && (t = a[1]);
        DisplaySEMessage(a[0], t), $(".reward_link_redeem_button_style").attr("disabled", !1), $(".orange_button").attr("disabled", !1)
    }))
}

function BonusEndCountdown(e, t) {
    var a, o, n, i, s = Date.now(),
        r = setInterval((function() {
            if (a = t - ((Date.now() - s) / 1e3 | 0), i = a - 60 * (n = (a - 60 * (o = a / 3600 | 0) * 60) / 60 | 0) - 60 * o * 60 | 0, o = o < 10 ? "0" + o : o, n = n < 10 ? "0" + n : n, i = i < 10 ? "0" + i : i, $("#bonus_span_" + e).html(o + "h:" + n + "m:" + i + "s"), a <= 0) return $("#bonus_container_" + e).hide(), void clearInterval(r)
        }), 1e3)
}

function DisplaySEMessage(e, t, a) {
    if ("" != e && 0 != e && null != e && "" != t && 0 != t && null != t) {
        clearTimeout(se_msg_timeout_id), $(".reward_point_redeem_result_box").removeClass("reward_point_redeem_result_error"), $(".reward_point_redeem_result_box").removeClass("reward_point_redeem_result_success"), $("#reward_point_redeem_result_container_div").show(), "s" == e ? $(".reward_point_redeem_result_box").addClass("reward_point_redeem_result_success") : "e" == e && $(".reward_point_redeem_result_box").addClass("reward_point_redeem_result_error"), $(".reward_point_redeem_result").html(t);
        var o = 15e3;
        a > 0 && (o = a), se_msg_timeout_id = setTimeout((function() {
            $("#reward_point_redeem_result_container_div").hide()
        }), o)
    }
}

function balanceChanged() {
    max_deposit_bonus > parseFloat(min_bonus_amount) && $(".dep_bonus_max").html(max_deposit_bonus + " BTC"), $("#balance2").html($("#balance").html()), $("#balance_small").html($("#balance").html()), balance_last_changed = Math.floor(Date.now() / 1e3)
}

function GenerateHashes(e) {
    for (var t = Math.random(), a = CryptoJS.SHA1(t.toString() + t.toString()).toString(CryptoJS.enc.Hex); - 1 == a.indexOf(e);)
        if (t = Math.random(), -1 !== (a = CryptoJS.SHA1(t.toString() + t.toString()).toString(CryptoJS.enc.Hex)).indexOf(e)) return t
}

function Reset2FAQuestions(e) {
    "secret_key_yes" == e ? ($("#reset_2fa_form_full").show(), $("#reset_2fa_subtype").val("secret_key"), $("#forgot_2fa_secret_key_container_div").show(), $("#forgot_2fa_extra_input").val(""), $("#forgot_2fa_extra_field").html("SECRET KEY")) : "secret_key_no" == e ? ($("#forgot_2fa_secret_key_container_div").hide(), $("#reset_2fa_form_full").hide(), $("#forgot_2fa_question_text").html("Did you provide a backup phone number for resetting your 2FA?"), $("#forgot_2fa_yes").attr("onclick", "Reset2FAQuestions('mobile_ver_yes')"), $("#forgot_2fa_no").attr("onclick", "Reset2FAQuestions('mobile_ver_no')")) : "mobile_ver_yes" == e ? ($("#forgot_2fa_secret_key_container_div").hide(), $("#reset_2fa_form_full").show(), $("#reset_2fa_subtype").val("mobile_ver"), $("#forgot_2fa_extra_input").val(""), $("#reset_2fa_warning").show(), $("#reset_2fa_warning").html("There is a small charge of $0.15 for this process that will be applied to your account after your 2FA has been reset. This charge is to cover our costs for sending the verification code to your phone.")) : "mobile_ver_no" == e ? ($("#reset_2fa_form_full").show(), $("#reset_2fa_subtype").val("email_ver"), $("#forgot_2fa_secret_key_container_div").hide(), $("#forgot_2fa_extra_input").val(""), $("#reset_2fa_warning").show(), $("#reset_2fa_warning").html("This procedure will take approximately 8 days to reset your 2FA. If you are able to use another way to reset your 2FA, please use that first.")) : "start_over" == e && ($("#reset_2fa_form_full").hide(), $("#reset_2fa_subtype").val(""), $("#forgot_2fa_extra_input").val(""), $("#reset_2fa_warning").hide(), $("#forgot_2fa_yes").attr("onclick", "Reset2FAQuestions('secret_key_yes')"), $("#forgot_2fa_no").attr("onclick", "Reset2FAQuestions('secret_key_no')"), $("#forgot_2fa_question_text").html("DO YOU HAVE THE 2FA SECRET KEY?"), $("#forgot_2fa_secret_key_container_div").hide())
}

function PlayCaptchasNetAudioCaptcha(e) {
    var t = document.createElement("audio");
    t.setAttribute("src", "//captchas.freebitco.in/cgi-bin/mp3/index.cgi?client=freebitcoin&random=" + e), t.setAttribute("autoplay", "autoplay"), t.addEventListener("load", (function() {
        t.play()
    }), !0)
}

function SwitchCaptchas(e) {
    var t = "recaptcha";
    "recaptcha" == e && (t = "double_captchas"), $("#free_play_" + t).hide(), $("#free_play_" + e).show(), $("#signup_" + t).hide(), $("#signup_" + e).show(), $("#switch_captchas_button").attr("onclick", "SwitchCaptchas('" + t + "')"), $.cookie.raw = !0, $.cookie("default_captcha", e, {
        expires: 3650,
        secure: !0,
        path: "/"
    })
}

function CountupTimer(e, t, a, o) {
    var n = e;
    void 0 !== e && (n = (n = n.replace(".", "")).replace("#", "")), void 0 !== countup_setintervals[n] && (clearInterval(countup_setintervals[n]), delete countup_setintervals[n]);
    var i = parseFloat(t);
    isNaN(o) && (o = 8);
    var s = 1e-8;
    i > 1 && (s *= i);
    var r = parseInt(-100 * Math.log10(i) + 300);
    r > 1e3 ? r = 1e3 : r < 100 && (r = 100);
    var l = i - s * (60 * a * 1e3 / r);
    l < 0 && (l = 0), $(e).html(ReplaceNumberWithCommas(parseFloat(l).toFixed(o))), i - l > 0 && (countup_setintervals[n] = setInterval((function() {
        (l += s) >= i ? ($(e).html(ReplaceNumberWithCommas(parseFloat(i).toFixed(o))), void 0 !== countup_setintervals[n] && (clearInterval(countup_setintervals[n]), delete countup_setintervals[n])) : l > 999 ? $(e).html(ReplaceNumberWithCommas(parseFloat(l).toFixed(o))) : $(e).html(parseFloat(l).toFixed(o))
    }), r))
}

function UpdateStats() {
    var e = 0;
    $.get("/cf_stats_public/?f=updating2", (function(t) {
        if (void 0 !== t && "success" == t.status) {
            var a = Math.floor((new Date).getTime() / 1e3);
            if (t.total_btc_won_number > 0 && (CountupTimer("#total_btc_won_number", t.total_btc_won_number, 15, 8), CountupTimer("#total_btc_won_number_signup_page", t.total_btc_won_number, 15, 8)), t.total_plays_number > 0 && CountupTimer("#total_plays_number", t.total_plays_number, 15, 0), t.total_signups_number > 0 && CountupTimer("#total_signups_number", t.total_signups_number, 15, 0), t.total_wagered_number > 0 && CountupTimer("#total_wagered_number", t.total_wagered_number, 15, 8), t.btc_price > 0 && $("#btc_usd_price").html("$" + ReplaceNumberWithCommas(parseFloat(100 * t.btc_price / 100).toFixed(2))), t.lambo_lottery_seed_hash.length > 0 && $("#lambo_lottery_hash").val(t.lambo_lottery_seed_hash), t.total_fun_savings > 0 && $("#total_fun_locked").html(ReplaceNumberWithCommas(t.total_fun_savings)), t.current_lottery_round > 0 && $(".current_lottery_round").html(ReplaceNumberWithCommas(parseInt(t.current_lottery_round))), t.lottery_prize_amount >= 0 && (CountupTimer(".lottery_first_prize", parseFloat(512 * t.lottery_prize_amount * 977517e-9 / 1e8), 15, 8), CountupTimer(".lottery_second_prize", parseFloat(256 * t.lottery_prize_amount * 977517e-9 / 1e8), 15, 8), CountupTimer(".lottery_third_prize", parseFloat(128 * t.lottery_prize_amount * 977517e-9 / 1e8), 15, 8), CountupTimer(".lottery_fourth_prize", parseFloat(64 * t.lottery_prize_amount * 977517e-9 / 1e8), 15, 8), CountupTimer(".lottery_fifth_prize", parseFloat(32 * t.lottery_prize_amount * 977517e-9 / 1e8), 15, 8), CountupTimer(".lottery_sixth_prize", parseFloat(16 * t.lottery_prize_amount * 977517e-9 / 1e8), 15, 8), CountupTimer(".lottery_seventh_prize", parseFloat(8 * t.lottery_prize_amount * 977517e-9 / 1e8), 15, 8), CountupTimer(".lottery_eighth_prize", parseFloat(4 * t.lottery_prize_amount * 977517e-9 / 1e8), 15, 8), CountupTimer(".lottery_ninth_prize", parseFloat(2 * t.lottery_prize_amount * 977517e-9 / 1e8), 15, 8), CountupTimer(".lottery_tenth_prize", parseFloat(1 * t.lottery_prize_amount * 977517e-9 / 1e8), 15, 8)), t.total_lottery_tickets >= 0 && (CountupTimer("#total_lottery_tickets", t.total_lottery_tickets, 15, 0), void 0 !== $("#user_lottery_tickets").html())) {
                var o = parseInt($("#user_lottery_tickets").html().replace(/\,/g, ""));
                o >= 0 ? $("#lottery_win_chance").html(ReplaceNumberWithCommas(parseFloat(100 * (1 - Math.pow((t.total_lottery_tickets - o) / t.total_lottery_tickets, 10)) * 1e8 / 1e8).toFixed(8))) : $("#lottery_win_chance").html("0.00000000")
            }
            if (t.lottery_seed_hash.length > 0 && $("#lottery_seed_hash").val(t.lottery_seed_hash), t.lottery_ticket_price > 0 && $(".lottery_ticket_price").html(parseFloat(t.lottery_ticket_price / 1e8).toFixed(8)), t.lottery_round_end > 0) {
                var n = $("#lottery_round_end").countdown("option", "until"),
                    i = new Date,
                    s = (r = parseInt(i.getTime() / 1e3)) + parseInt(n);
                (t.lottery_round_end - s > 29 || s - t.lottery_round_end > 29) && ($("#lottery_round_end").countdown("destroy"), $("#lottery_round_end").countdown({
                    until: "+" + parseInt(t.lottery_round_end) - r,
                    format: "DHMS"
                }))
            }
            if (t.lottery_wager.length > 0 && $(".lottery_wager").html(t.lottery_wager), t.wager_contest.wager.length > 0 && PrintWagerContestTables("wager_promotion_wager_contest", t.wager_contest.wager, "wager"), t.wager_contest.ref_contest.length > 0 && PrintWagerContestTables("wager_promotion_ref_contest", t.wager_contest.ref_contest, "ref"), parseInt(t.wager_contest.contest_end) > 0) {
                var r, l = parseInt(t.wager_contest.contest_end),
                    _ = $("#wager_contest_end").countdown("option", "until"),
                    c = (i = new Date, (r = parseInt(i.getTime() / 1e3)) + parseInt(_));
                (l - c > 29 || c - l > 29) && ($("#wager_contest_end").countdown("destroy"), $("#wager_contest_end").countdown({
                    until: "+" + parseInt(l) - r,
                    format: "DHMS"
                }))
            }
            if (userid > 0) {
                if (0 == user_flash_offer && 0 == show_ftd_offer)
                    if (void 0 !== t.deposit_promo_ends && t.deposit_promo_ends > 0 && t.deposit_promo_ends > a) {
                        var d = "https://sirv.freebitco.in/1624261540_HCkItJiK.png";
                        $("body").innerWidth() < 769 ? 0 == new_user_first_load && $("#deposit_promo_message_mobile").show() : (d = "https://sirv.freebitco.in/1624261505_jbtvbXeG.png", 0 == new_user_first_load && $("#deposit_promo_message_regular").show()), $(".deposit_promo_message_content").html('<div style="display: inline-block; height: auto;" class="center deposit_promo_msg"><img src="' + d + '" data-reveal-id="myModal16"><div class="deposit_promo_time_remaining countdown_time_remaining" style="margin: auto; margin-top: 10px; margin-bottom: 10px;"></div></div>'), $(".deposit_promo_time_remaining").countdown("destroy"), $(".deposit_promo_time_remaining").countdown({
                            until: +(t.deposit_promo_ends - a),
                            format: "HMS"
                        }), $(".deposit_promo_msg").show()
                    } else if (a > t.double_lambo_start && a < t.double_lambo_end) d = "https://sirv.freebitco.in/1589617329_3k8YBqsV.jpg", $("body").innerWidth() < 769 ? 0 == new_user_first_load && $("#deposit_promo_message_mobile").show() : (d = "https://sirv.freebitco.in/1589617343_FP0a0XRD.jpg", 0 == new_user_first_load && $("#deposit_promo_message_regular").show()), $(".deposit_promo_message_content").html('<div style="display: inline-block; height: auto;" class="center deposit_promo_msg"><img src="' + d + '" onclick="SwitchPageTabs(\'double_your_btc\');"><div class="deposit_promo_time_remaining countdown_time_remaining" style="margin: auto; margin-top: 10px; margin-bottom: 10px;"></div></div>'), $(".deposit_promo_time_remaining").countdown("destroy"), $(".deposit_promo_time_remaining").countdown({
                    until: +(t.double_lambo_end - a),
                    format: "HMS"
                }), $("#bonus_weekend_rp_multiplier").parent().css({
                    "font-size": "20px"
                }), $("#bonus_weekend_rp_multiplier").parent().html("2X GOLDEN TICKETS"), $("#bonus_weekend_msg_div").show(), $("#golden_tix_2x_promo").show(), $("#multiply_free_golden_tix").html("2"), $("#multiply_free_golden_tix").parent().css({
                    "font-weight": "bold"
                });
                else if (a > t.bonanza_start && a < t.bonanza_end) d = "https://sirv.freebitco.in/1697269760_6Yw4doWv.png", $("body").innerWidth() < 769 ? 0 == new_user_first_load && $("#deposit_promo_message_mobile").show() : (d = "https://sirv.freebitco.in/1695641731_H6sviepA.png", 0 == new_user_first_load && $("#deposit_promo_message_regular").show()), $(".deposit_promo_message_content").html('<div style="display: inline-block; height: auto;" class="center deposit_promo_msg"><img src="' + d + '" onclick="SwitchPageTabs(\'double_your_btc\');"><div class="deposit_promo_time_remaining countdown_time_remaining" style="margin: auto; margin-top: 10px; margin-bottom: 10px;"></div></div>'), $(".deposit_promo_time_remaining").countdown("destroy"), $(".deposit_promo_time_remaining").countdown({
                    until: +(t.bonanza_end - a),
                    format: "DHMS"
                }), $("#bonus_weekend_rp_multiplier").parent().css({
                    "font-size": "20px"
                }), $("#bonus_weekend_rp_multiplier").parent().html("3-4-5 BONANZA"), $("#bonus_weekend_msg_div").show(), $("#multiply_free_golden_tix").html("3"), $("#multiply_free_golden_tix").parent().css({
                    "font-weight": "bold"
                }), $(".multiply_rp_amount").html("5"), $(".multiply_rp_amount").parent().css({
                    "font-weight": "bold"
                }), $(".multiply_lottery_amount").html("4"), $(".multiply_lottery_amount").parent().css({
                    "font-weight": "bold"
                }), $(".multiply_golden_tix_amount").html("3"), $(".multiply_golden_tix_amount").parent().css({
                    "font-weight": "bold"
                });
                else {
                    var u = t.rp_promo_details.split("-");
                    if (1 == parseInt(u[2]) && parseInt(u[3]) < a && parseInt(u[4]) > a) {
                        var p = parseInt(u[0]),
                            b = {
                                "2x": "https://sirv.freebitco.in/1698754871_2yyRko2D.png",
                                "2x_mobile": "https://sirv.freebitco.in/1698754394_0A5XuJ0b.png",
                                "3x": "https://sirv.freebitco.in/1698754928_8HO5dswC.png",
                                "3x_mobile": "https://sirv.freebitco.in/1698754326_PFYVDRZQ.png",
                                "4x": "https://sirv.freebitco.in/1698754994_JEFYuwpJ.png",
                                "4x_mobile": "https://sirv.freebitco.in/1698754753_pnmroaBo.png",
                                "5x": "https://sirv.freebitco.in/1698755048_izIvMBw2.png",
                                "5x_mobile": "https://sirv.freebitco.in/1698754682_Pi9559nj.png"
                            };
                        d = b[p + "x_mobile"], $("body").innerWidth() < 769 ? 0 == new_user_first_load && $("#deposit_promo_message_mobile").show() : (d = b[p + "x"], 0 == new_user_first_load && $("#deposit_promo_message_regular").show()), $(".deposit_promo_message_content").html('<div style="display: inline-block; height: auto;" class="center deposit_promo_msg"><img src="' + d + '" onclick="SwitchPageTabs(\'double_your_btc\');"><div class="deposit_promo_time_remaining countdown_time_remaining" style="margin: auto; margin-top: 10px; margin-bottom: 10px;"></div></div>'), $(".deposit_promo_time_remaining").countdown("destroy"), $(".deposit_promo_time_remaining").countdown({
                            until: +(parseInt(u[4]) - a),
                            format: "HMS"
                        })
                    } else if (a > 1627491600 && a < 1628121540) d = "https://sirv.freebitco.in/1627475525_3wnA8PtH.png", $("body").innerWidth() < 769 ? 0 == new_user_first_load && $("#deposit_promo_message_mobile").show() : (d = "https://sirv.freebitco.in/1627475577_ySb1VRyt.png", 0 == new_user_first_load && $("#deposit_promo_message_regular").show()), $(".deposit_promo_message_content").html('<div style="display: inline-block; height: auto;" class="center deposit_promo_msg"><img src="' + d + '" data-reveal-id="fun_trading_contest"><div class="deposit_promo_time_remaining countdown_time_remaining" style="margin: auto; margin-top: 10px; margin-bottom: 10px;"></div></div>'), $(".deposit_promo_time_remaining").countdown("destroy"), $(".deposit_promo_time_remaining").countdown({
                        until: +(1628121540 - a),
                        format: "DHMS"
                    }), $(".binance_trading_contest_show").show();
                    else if (Object.keys(t.fbtc_special_top_banner_mobile).length > 0 && Object.keys(t.fbtc_special_top_banner_desktop).length > 0) {
                        var m;
                        if ($("body").innerWidth() < 769) {
                            const e = Object.keys(t.fbtc_special_top_banner_mobile);
                            B = e[Math.floor(Math.random() * e.length)], 0 == new_user_first_load && $("#deposit_promo_message_mobile").show(), m = t.fbtc_special_top_banner_mobile[B]
                        } else {
                            const e = Object.keys(t.fbtc_special_top_banner_desktop);
                            B = e[Math.floor(Math.random() * e.length)], 0 == new_user_first_load && $("#deposit_promo_message_regular").show(), m = t.fbtc_special_top_banner_desktop[B]
                        }
                        var h = '<div style="display: inline-block; height: auto;" class="center deposit_promo_msg">';
                        (T = B.split("-|-|-|-|-|-"))[1].indexOf("http") > -1 ? (T[1].indexOf("{{email}}") > -1 && (T[1] = T[1].replace("{{email}}", user_email)), h = h + '<a href="' + T[1] + '" target=_blank><img src="' + T[0] + '"></a>') : h = h + '<a href="javascript:void(0);" onclick="SwitchPageTabs(\'' + T[1] + '\');"><img src="' + T[0] + '"></a>', m < a + 7776e3 && (h += '<div class="deposit_promo_time_remaining countdown_time_remaining" style="margin: auto; margin-top: 10px; margin-bottom: 10px;"></div>'), h += "</div>", $(".deposit_promo_message_content").html(h), m < a + 7776e3 && ($(".deposit_promo_time_remaining").countdown("destroy"), $(".deposit_promo_time_remaining").countdown({
                            until: +(m - a),
                            format: "DHMS"
                        }))
                    } else $(".deposit_promo_msg").hide(), $("#deposit_promo_message_mobile").hide(), $("#deposit_promo_message_regular").hide()
                }
                for (var f = 0; f < t.parimutuel_events.length; f++) {
                    if (t.parimutuel_events[f].game_pot > 0) {
                        var g = parseFloat(parseInt(t.parimutuel_events[f].game_pot) / 1e8).toFixed(8);
                        a = Math.floor((new Date).getTime() / 1e3), t.parimutuel_events[f].bets_paused > a ? CountupTimer(".parimutuel_prize_pool_" + t.parimutuel_events[f].game_id, g, 15, 8) : $(".parimutuel_prize_pool_" + t.parimutuel_events[f].game_id).html(g)
                    }
                    t.parimutuel_events[f].time_weight > 0 && $(".parimutuel_time_weight_" + t.parimutuel_events[f].game_id).html("&nbsp;" + t.parimutuel_events[f].time_weight + "x");
                    for (var y = 0; y < t.parimutuel_events[f].outcomes.length; y++)
                        if (t.parimutuel_events[f].outcomes[y].bets_count > 0 && $("#parimutuel_outcome_" + t.parimutuel_events[f].outcomes[y].game_id + "_" + t.parimutuel_events[f].outcomes[y].outcome + "_li .parimutuel_outcome_bets_count").html(commaSeparateNumber(parseInt(t.parimutuel_events[f].outcomes[y].bets_count))), t.parimutuel_events[f].outcomes[y].odds > 0 && $("#parimutuel_outcome_" + t.parimutuel_events[f].outcomes[y].game_id + "_" + t.parimutuel_events[f].outcomes[y].outcome + "_li .parimutuel_outcome_bet_odds").html(t.parimutuel_events[f].outcomes[y].odds), t.parimutuel_events[f].outcomes[y].popularity > 0) {
                            var w = parseInt(t.parimutuel_events[f].outcomes[y].popularity);
                            w > 100 && (w = 100);
                            var v = "red";
                            w > 24 && w < 50 ? v = "orange" : w > 49 && w < 75 ? v = "yellow" : w > 74 && (v = "green"), $("#parimutuel_outcome_" + t.parimutuel_events[f].outcomes[y].game_id + "_" + t.parimutuel_events[f].outcomes[y].outcome + "_li .progress_bar_container_div").html('<p class="' + v + '_progress_bar" style="width: ' + w + '%;"> </p><span style="width: 100%; position: absolute; top:0; left: 0; background-color: transparent; text-align: center; padding-top: 4px; font-weight: 900;">' + w + "%</span>")
                        }
                }
                if (void 0 !== t.daily_jackpot_round && t.daily_jackpot_round > 0 && void 0 !== t.daily_jackpot_end && t.daily_jackpot_end > a) {
                    var k = '<h1 style="color:#008235;font-size:20px;text-align: center;margin:0;font-family: \'Hepta Slab\', serif;">DAILY JACKPOT</h1><h3 style="color:#000;text-align: center;font-size:18px;margin:0;">LEADERBOARD</h3><div style="width: 260px; display: block; margin: auto; clear: both; background-image: linear-gradient(to bottom, #ff7c1a, #ff6d00 90%);border-radius: 5px 5px 0 0;height:32px;"><div class="leaderboard_table_header_columns" style="width: 50px;">RANK</div><div class="leaderboard_table_header_columns" style="width: 90px;">USERID</div><div class="leaderboard_table_header_columns" style="width: 120px;">WAGERED</div></div>';
                    for (f = 0; f < t.daily_jackpot_ranks.length; f++) t.daily_jackpot_ranks[f].wagered = parseFloat(t.daily_jackpot_ranks[f].wagered / 1e8).toFixed(8), k = 1 == t.daily_jackpot_ranks[f].rank ? k + '<div id="leaderboard_table_winner_row" style="width: 280px; height: 35px; display: block; margin: auto; clear: both; padding: 11px 0;background-image: linear-gradient(to bottom, #003c5f, #001927 90%);color:gold;box-shadow: 0px 5px 5px #000;"><div style="width:30px;float:left;text-align:center;margin-top:-2px;"><i class="fa fa-trophy" aria-hidden="true"></i></div><div class="leaderboard_table_winner_row_columns" style="width: 30px;font-size:13px;text-align:left;">' + t.daily_jackpot_ranks[f].rank + '</div><div class="leaderboard_table_winner_row_columns" style="width: 90px;font-size:13px;">' + t.daily_jackpot_ranks[f].userid + '</div><div class="leaderboard_table_winner_row_columns" style="width: 120px;font-size:13px;">' + t.daily_jackpot_ranks[f].wagered + "</div></div>" : k + '<div style="width: 260px; display: block; margin: auto; clear: both;"><div class="leaderboard_table_columns" style="width: 50px;font-size:12px;">' + t.daily_jackpot_ranks[f].rank + '</div><div class="leaderboard_table_columns" style="width: 90px;font-size:12px;">' + t.daily_jackpot_ranks[f].userid + '</div><div class="leaderboard_table_columns" style="width: 120px;font-size:12px;">' + t.daily_jackpot_ranks[f].wagered + "</div></div>";
                    k = k + '<div class="daily_jackpot_your_stats_container_div"><div class="daily_jackpot_your_stats_header gold">YOUR STATS</div><div class="daily_jackpot_your_stats_rows"><div class="daily_jackpot_your_stats_rank_wagered_columns">RANK</div><div class="daily_jackpot_your_stats_rank_wagered_values_columns" id="daily_jackpot_user_rank">' + user_daily_jp_rank + '</div></div><div class="daily_jackpot_your_stats_rows" style="display:block; width:100%;"><div class="daily_jackpot_your_stats_rank_wagered_columns" style="border-top: 1px solid transparent;border-radius: 0 0 0 5px;">WAGERED</div><div class="daily_jackpot_your_stats_rank_wagered_values_columns" id="daily_jackpot_user_wagered" style="border-top: 1px solid transparent;border-radius:0 0 5px 0;">' + user_daily_jp_wagered + "</div></div></div>", $("#daily_jackpot_leaderboard_modal_content").html(k);
                    var x = '<div class="close_daily_jackpot_main_container_div" onclick="CloseDailyJPBanner();"><i class="fa fa-times-circle" aria-hidden="true"></i></div><div class="black_background_div"><div class="daily_jackpot_prize_div"><div class="background_span"><div class="left_marker"></div><i class="fa fa-btc fa-btc-900"></i><div class="right_marker"></div></div>';
                    for (x += '<div class="background_span"><div class="left_marker"></div><p id="daily_jp_pot_digit_1"></p><div class="right_marker"></div></div><div class="background_span"><div class="left_marker"></div><p class="decimalpoint">.</p><div class="right_marker"></div></div>', f = 2; f < 10; f++) x = x + '<div class="background_span"><div class="left_marker"></div><p id="daily_jp_pot_digit_' + f + '"></p><div class="right_marker"></div></div>';
                    x = x + '</div><div class="daily_jackpot_your_rank_div">YOUR RANK&nbsp;<span id="daily_jp_user_rank">#' + user_daily_jp_rank + "</span></div></div>", x += '<div class="yellow_background"><h1>WIN DAILY JACKPOT</h1><p>HIGHEST DAILY WAGERER / BETTOR WILL WIN THE JACKPOT!</p></div><div class="daily_jackpot_text_for_extra_small"><p>HIGHEST DAILY WAGERER / BETTOR WILL WIN THE JACKPOT!</p></div><div class="daily_jackpot_text_for_small"><p>HIGHEST DAILY WAGERER / BETTOR WILL WIN THE JACKPOT!</p></div><div class="leaderboard_button_timer_container_div"><div class="leaderboard_winner_button_container_div"><div class="leaderboard_button" data-reveal-id="daily_jackpot_leaderboard_modal"><img src="https://sirv.freebitco.in/1566561624_xUklV3EW.png"><span>LEADERBOARD</span></div><div class="winners_button" data-reveal-id="daily_jackpot_winners_modal"><i class="fa fa-trophy trophy_winners_button" aria-hidden="true"></i><span>WINNERS</span></div></div><div class="timer_div_daily_jackpot"></div></div></div>', $(".daily_jackpot_main_container_div").html(x), t.daily_jackpot_end > 0 && ($(".timer_div_daily_jackpot").countdown("destroy"), $(".timer_div_daily_jackpot").countdown({
                        until: +(t.daily_jackpot_end - a),
                        format: "HMS"
                    })), daily_jp_countup_stop = 1, t.daily_jp_starting_pot = t.daily_jackpot_pot - 45e3, t.daily_jp_starting_pot < 0 && (t.daily_jp_starting_pot = 0), setTimeout((function() {
                        daily_jp_countup_stop = 0, CountupDailyJPPot(t.daily_jp_starting_pot, t.daily_jackpot_pot, t.daily_jackpot_end)
                    }), 2e3)
                }
                if (void 0 !== t.daily_jackpot_winners) {
                    var C = '<h1 style="color:#008235;font-size:20px;text-align: center;margin:0;font-family: \'Hepta Slab\', serif;">DAILY JACKPOT</h1><h3 style="color:#000;text-align: center;font-size:18px;margin:0;">WINNERS</h3><div style="width: 260px; display: block; margin: auto; clear: both; background-image: linear-gradient(to bottom, #ff7c1a, #ff6d00 90%);border-radius: 5px 5px 0 0;height:32px;"><div class="leaderboard_table_header_columns" style="width: 90px;">DATE</div><div class="leaderboard_table_header_columns" style="width: 70px;">USER ID</div><div class="leaderboard_table_header_columns" style="width: 100px;">PRIZE</div></div>';
                    for (f = 0; f < t.daily_jackpot_winners.length; f++) t.daily_jackpot_winners[f].prize = parseFloat(t.daily_jackpot_winners[f].prize / 1e8).toFixed(8), C = C + '<div style="width: 260px; display: block; margin: auto; clear: both;"><div class="leaderboard_table_columns" style="width: 90px;">' + t.daily_jackpot_winners[f].date + '</div><div class="leaderboard_table_columns" style="width: 70px;">' + t.daily_jackpot_winners[f].userid + '</div><div class="leaderboard_table_columns" style="width: 100px;">' + t.daily_jackpot_winners[f].prize + "</div></div>";
                    $("#daily_jackpot_winners_modal_content").html(C)
                }
                var B, T;
                for (t.fbtc_cross_promo_bottom.length > 0 && ((T = (B = t.fbtc_cross_promo_bottom[Math.floor(Math.random() * t.fbtc_cross_promo_bottom.length)]).split("-|-|-|-|-|-"))[1].indexOf("http") > -1 ? $(".cross_promo_msg_div").html('<p class="bold inpage_promo_box" style="cursor:pointer;"><a href="' + T[1] + '" target="_blank">' + T[0] + "</a></p>") : $(".cross_promo_msg_div").html('<p class="bold inpage_promo_box" style="cursor:pointer;"><a href="javascript:void(0);" onclick="SwitchPageTabs(\'' + T[1] + "');\">" + T[0] + "</a></p>")), $("body").innerWidth() < 750 ? t.fbtc_bottom_banners_mobile.length > 0 && ((T = (B = t.fbtc_bottom_banners_mobile[Math.floor(Math.random() * t.fbtc_bottom_banners_mobile.length)]).split("-|-|-|-|-|-"))[1].indexOf("http") > -1 ? (T[1].indexOf("{{email}}") > -1 && (T[1] = T[1].replace("{{email}}", user_email)), $("#bottom_user_ads_container").html('<a href="' + T[1] + '" target=_blank><img src="' + T[0] + '"></a>')) : $("#bottom_user_ads_container").html('<a href="javascript:void(0);" onclick="SwitchPageTabs(\'' + T[1] + '\');"><img src="' + T[0] + '"></a>')) : t.fbtc_bottom_banners_desktop.length > 0 && ((T = (B = t.fbtc_bottom_banners_desktop[Math.floor(Math.random() * t.fbtc_bottom_banners_desktop.length)]).split("-|-|-|-|-|-"))[1].indexOf("http") > -1 ? (T[1].indexOf("{{email}}") > -1 && (T[1] = T[1].replace("{{email}}", user_email)), $("#bottom_user_ads_container").html('<a href="' + T[1] + '" target=_blank><img src="' + T[0] + '"></a>')) : $("#bottom_user_ads_container").html('<a href="javascript:void(0);" onclick="SwitchPageTabs(\'' + T[1] + '\');"><img src="' + T[0] + '"></a>')), t.market_cap = parseInt(6548879189 * t.fun_price_usd_now), t.usd_per_30d = parseFloat(100 * (t.fun_price_usd_now / t.fun_price_usd_30d - 1)).toFixed(2), t.per_30d_style = "color:green;", t.usd_per_30d < 0 ? t.per_30d_style = "color:red;" : t.usd_per_30d = "+" + t.usd_per_30d, $("#fun_price_current").html(t.fun_price_now + ' BTC <span style="color:blue;">$' + t.fun_price_usd_now + '</span> <span style="font-weight:bold; ' + t.per_30d_style + '">&nbsp;' + t.usd_per_30d + '%</span>&nbsp;<span style="font-weight:normal;">(30d)</span>'), e = parseInt(t.fun_price_update_time), f = 0; f < 720; f++) thirty_day_arr_btc.push(1e8 * t.fun_btc_chart_data[f]), thirty_day_arr_usd.push(t.fun_usd_chart_data[f]), i = new Date(1e3 * (e - 3600 * f)), thirty_day_arr_time.push(i);
                thirty_day_arr_time.reverse(), thirty_day_arr_btc.reverse(), thirty_day_arr_usd.reverse(), PriceChart("fun_chart")
            }
            void 0 !== t.rp_for_wof && (rp_wof_price = t.rp_for_wof, $("#rp_wof_tix_price").html(rp_wof_price))
        }
    })), setTimeout(UpdateStats, 9e5)
}

function CountupDailyJPPot(e, t, a) {
    if (0 == daily_jp_countup_stop && e < t) {
        var o = Math.floor((new Date).getTime() / 1e3),
            n = e + Math.floor(10 * Math.random());
        o >= a && (n = t);
        var i = n.toString().split(""),
            s = (i.length, 9 - i.length);
        if (s > 0)
            for (var r = 0; r < s; r++) i.unshift("0");
        for (r = 1; r < 10; r++) $("#daily_jp_pot_digit_" + r).html(i[r - 1]);
        setTimeout((function() {
            CountupDailyJPPot(n, t, a)
        }), 100)
    }
}

function PrintWagerContestTables(e, t, a) {
    var o = "";
    1 == mobile_device && (o = "lottery_table_mobile_style");
    for (var n = [1e4, 5e3, 2500, 1250, 1e3, 750, 500, 300, 200, 100], i = [5e3, 2500, 1250, 600, 500, 400, 300, 200, 100, 50], s = "", r = 0; r < t.length; r++) {
        var l = "wager_rank_7_8_9_10";
        0 == r ? l = "wager_rank_1" : 1 == r || 2 == r ? l = "wager_rank_2_3" : 3 != r && 4 != r && 5 != r || (l = "wager_rank_4_5_6");
        var _ = n[r],
            c = parseFloat(t[r].wagered / 1e8).toFixed(8);
        "ref" == a && (_ = i[r]), s = s + '<div class="large-12 small-12 columns center ' + l + '_container"><div class="large-1 small-1 columns center wager_table_cell ' + l + " lottery_winner_table_first_last_cell " + o + '"><p class="wager_rank">' + (r + 1) + '</p></div><div class="large-11 small-11 columns"><div class="row"><div class="large-3 small-3 columns center wager_table_cell ' + l + " lottery_winner_table_second_cell " + o + '">' + t[r].userid + '</div> <div class="large-5 small-5 columns center wager_table_cell ' + l + " lottery_winner_table_second_cell " + o + '"><i class="fa fa-btc" aria-hidden="true"></i>&nbsp;<span>' + ReplaceNumberWithCommas(c) + '</span></div><div class="large-4 small-4 columns center wager_table_cell ' + l + " lottery_winner_table_third_cell " + o + '" style="border-right: none;">$&nbsp;<span>' + ReplaceNumberWithCommas(_) + "</span></div></div></div></div>"
    }
    $("#" + e).html(s)
}

function InitialUserStats() {
    $.get("/cf_stats_private/?u=" + socket_userid + "&p=" + socket_password + "&f=user_stats_initial", (function(e) {
        if ("success" == e.status) {
            for (property in GenerateStatsTables("PAYMENTS SENT (LAST 30 DAYS, MAX. 25)", "TIME", "ADDRESS", "AMOUNT", "TRANSACTION", e.payments_sent, "personal_stats_page_tables"), GenerateStatsTables("DEPOSITS (LAST 25)", "TIME", "ADDRESS", "AMOUNT", "TRANSACTION", e.deposits, "personal_stats_page_tables"), e.user) "free_spins_played" == property || "paid_spins_played" == property ? $("#user_" + property).html(ReplaceNumberWithCommas(parseInt(e.user[property]))) : $("#user_" + property).html(ReplaceNumberWithCommas(parseFloat(e.user[property] / 1e8).toFixed(8)));
            if (last_nonce = parseInt(e.user.paid_spins_played) + parseInt(e.user.free_spins_played), e.lambo_lottery_ends > 0 && $(".golden_ticket_time_remaining").countdown({
                    until: +e.lambo_lottery_ends,
                    format: "DHMS"
                }), new_user_first_load = 0, $("#free_play_alert_boxes").show(), $("#fp_multiplier_bonuses_main_div").show(), $("#fp_provably_fair_link").show(), $("#play_without_captcha_container").show(), $(".daily_jackpot_main_container_div").show(), e.no_captcha_wof_tokens > 0 ? InsertAlertMsg("free_wof_spins", "<font color=red>**PREMIUM MEMBER ALERT**</font> You have <font color=red>" + e.no_captcha_wof_tokens + '</font> FREE WOF SPINS. <a href="https://freebitco.in/static/html/wof/wof-premium.html" target=_blank onclick="CloseAlertMsg(\'free_wof_spins\',0.1); return true;">Play them here!</a>', 1) : 1 == Math.round(Math.random()) ? InsertAlertMsg("premium_membership", 'Introducing Premium Membership Token - <font color=red>1% cashback on MULTIPLY BTC/BETTING</font>. <font color=blue>16 free Wheel of Fortune spins daily</font> and <font color=green>25% increase to interest rates</font>. <a href="javascript:void(0);" onclick="SwitchPageTabs(\'loyalty_token\');">Click here for more details</a>.', 3) : InsertAlertMsg("rp_for_wof", '<font color=red>**NEW FEATURE ALERT**</font> Exchange your Reward Points for Wheel of Fortune tickets! <a href="javascript:void(0);" data-reveal-id="rp_for_wof_modal" class="bold">CLICK TO TRY IT NOW</a>', 3), e.interest_boost > 0) {
                var t = parseFloat(4.08 + 4.08 * e.interest_boost / 100).toFixed(2);
                daily_interest_rate = parseFloat(daily_interest_rate + daily_interest_rate * e.interest_boost / 100).toFixed(8);
                var a = parseFloat(t - 4.08).toFixed(2);
                $("#interest_apr").html(t + '% <span style="color: green;">(+' + a + "%)</span>*"), $("#daily_interest_rate").html(daily_interest_rate + "% *"), $("#int_bonus_msg").show()
            }
            if (null != e.eth_address && ($("#eth_deposit_address_box").show(), $("#eth_deposit_address_qr_code").html('<img src="//chart.googleapis.com/chart?cht=qr&chs=200x200&chl=' + e.eth_address + '&chld=H|0">'), $("#eth_deposit_address").val(e.eth_address), $("#new_eth_address_button").hide()), null != e.interest_boost || null != e.cashback || null != e.daily_wof_spins) {
                var o = e.interest_boost,
                    n = e.cashback,
                    i = e.daily_wof_spins;
                null == o && (o = 0), null == n && (n = 0), null == i && (i = 0), $("#user_premium_wof_daily").html(i), $("#user_premium_int_boost").html(o + "%"), $("#user_premium_cashback").html(n + "%")
            }
            if (null != e.fun_buyer && 1 == e.fun_buyer ? $("#fun_tx_history_link").show() : $(".fun_holder_show").hide(), null != e.vip_lvl_days) {
                var s = "",
                    r = "reward_table_box_left",
                    l = "reward_table_box_right";
                $("body").innerWidth() < 769 && (r = "reward_table_box_left_mobile", l = "reward_table_box_right_mobile");
                for (var _ = [0, 1, 30, 90, 180, 360], c = 0, d = 0; d < 7; d++) null != e.vip_lvl_days[d] && null != e.vip_lvl_days[d] && e.vip_lvl_days[d] > 0 && (s = s + '<div class="large-6 small-12 columns center reward_table_box ' + r + '"> LEVEL ' + (d + 1) + ' </div><div class="large-6 small-12 columns center reward_table_box ' + l + '"> ' + e.vip_lvl_days[d] + ' </div><div class="large-12 small-12 columns center" style="height:10px;"> </div>', c = d + 1);
                for (var u = 0, p = 0, b = 0; b < _.length; b++) e.vip_lvl_days[c - 1] >= _[b] && _[b] >= u && (u = _[b], p = b);
                var m = "";
                if ($("body").innerWidth() < 769 && (m = "lottery_table_mobile_style"), u < 360) {
                    var h = parseInt(_[p + 1]),
                        f = [0, 2500, 5e3, 12500, 5e4, 125e3, 25e4, 5e5][c],
                        g = _[p + 1] - e.vip_lvl_days[c - 1] || 0;
                    $("#premium_user_next_benefits_table").html('<p class=bold>BENEFITS IN <span style="color:red;">' + g + ' DAYS</span></p><div class="large-7 small-12 large-centered small-centered columns change_size_css"><div class="large-12 small-12 columns center lottery_winner_table_box_container my_tickets_row_one"><div class="large-4 small-4 columns center table_header_background lottery_winner_table_box ' + m + '" style="border-radius: 5px 0 0 0;"> WOF/DAY </div><div class="large-4 small-4 columns center table_header_background lottery_winner_table_box ' + m + '" style="border-left: none; border-right: none;"> CASHBACK </div><div class="large-4 small-4 columns center table_header_background lottery_winner_table_box ' + m + '" style="border-radius: 0 5px 0 0;"> INTEREST </div></div><div class="large-12 small-12 columns center lottery_winner_table_box_container my_tickets_row_two "><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell font_bold ' + m + '" style="border-radius: 0 0 0 5px;"> ' + fun_benefit_tiers_new[f][h].wof + ' </div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell font_bold ' + m + '"> ' + fun_benefit_tiers_new[f][h].cb + '% </div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell font_bold ' + m + '" style="border-radius: 0 0 5px 0;"> ' + fun_benefit_tiers_new[f][h].int + "% </div></div></div>"), $("#premium_user_next_benefits_table").show()
                }
                $("#fun_vip_benefit_days_table").html(""), $("#fun_vip_benefit_days_table").html(s)
            }
            if (mobile_class = "", 1 == mobile_device && (mobile_class = " lottery_table_mobile_style "), $("#interest_history_table").html('<div class="large-12 small-12 columns center lottery_winner_table_box table_header_background br_5_5"><div class="center" style="margin:auto;">RECENT INTEREST PAYMENTS</div></div><div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + mobile_class + '"> <span class="bold">DATE</span> </div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell ' + mobile_class + '"> <span class="bold">BALANCE</span> </div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + mobile_class + '"> <span class="bold">INTEREST</span> </div></div>'), null != e.interest_history_hash && e.interest_history_hash.length > 0) {
                var y = e.interest_history_hash;
                for (d = 0; d < y.length; d++) $("#interest_history_table").append('<div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + mobile_class + '">' + y[d].date + '</div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell' + mobile_class + '">' + y[d].balance + '</div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + mobile_class + '">' + y[d].interest + "</div> </div>");
                $("#interest_history_table_row").show()
            }
            if (null != e.fun_tx_history && e.fun_tx_history.length > 0) {
                var w = $("#fun_tx_history_table").DataTable(),
                    v = e.fun_tx_history;
                for (d = 0; d < v.length; d++) {
                    var k = new Date(parseInt(1e3 * v[d].time));
                    w.row.add([k.toLocaleString("en-uk"), v[d].type.toUpperCase(), parseInt(v[d].qty), parseFloat(v[d].sats / 1e8).toFixed(8)]).draw(!1)
                }
            }
            if (parimutuel_bet_history_json = e.bets, null != e.fun_savings_hash) {
                (w = $("#fun_locked_savings_table").DataTable()).clear().draw();
                var x = e.fun_savings_hash;
                for (const e in x) {
                    var C = e.split("-");
                    k = new Date(parseInt(1e3 * C[1])), w.row.add([C[2], C[5], C[3], C[4] + "%", k.toLocaleString("en-uk")]).draw(!1)
                }
            }
            var B = Math.floor((new Date).getTime() / 1e3);
            user_flash_offer = e.flash_offer_end > B ? 1 : 0, user_stats_loaded = 1
        }
    }))
}

function InitialStatsLoad() {
    0 == initial_public_stats_loaded && ($("#please_wait_loading_page").show(), $.get("/cf_stats_public/?f=public_stats_initial", (function(e) {
        if (void 0 !== e && "success" == e.status) {
            if (0 == rp_rewards_list_loaded) {
                var t = "",
                    a = "";
                1 == mobile_device && (t = " reward_link_redeem_button_mobile ", a = " reward_link_redeem_button_mobile_last ");
                for (var o = 0; o < e.rp_prizes.length; o++) $("#" + e.rp_prizes[o].category + "_rewards").append('<div class="effect2" style="margin: 0; border-radius: 3px; margin-top: 20px;"><div class="row reward_product_name">' + e.rp_prizes[o].product_name + '</div><div class="row" style="margin:0; padding: 10px 0; border: 1px solid #bdbcb8; border-radius: 0 0 3px 3px; background:#fff;"><div class="large-3 small-12 columns"><div class="reward_link_redeem_button_style' + t + '" onclick="VisitLink(\'' + e.rp_prizes[o].product_link + '\')">LINK</div></div><div class="large-6 small-12 columns"><div class="reward_dollar_value_style' + t + '">' + e.rp_prizes[o].points + ' RP</div></div><div class="large-3 small-12 columns"><button class="reward_link_redeem_button_style ' + a + '" onclick="RedeemRPProduct(\'' + e.rp_prizes[o].product_type + "')\">REDEEM</button></div></div></div>");
                rp_rewards_list_loaded = 1
            }
            parseInt(e.previous_lambo_winner.round) > 0 && (t = "", $("body").innerWidth() < 769 && (t = " lottery_table_mobile_style "), $("#previous_lambo_lottery_winners_list_div").html('<div class="large-12 small-12 columns center lottery_winner_table_box table_header_background br_5_5"><div class="center" style="margin:auto;">ROUND ' + e.previous_lambo_winner.round + '</div></div><div class="large-12 small-12 columns center lottery_winner_table_box"><div class="center bold" style="margin:auto;">TOTAL TICKETS: ' + ReplaceNumberWithCommas(e.previous_lambo_winner.total_tickets) + '</div></div><div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + t + '"><span class=bold>USER ID</span></div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell' + t + '"><span class=bold>AMOUNT WON</span></div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + t + '"><span class=bold>USER TICKETS</span></div></div><div class="large-12 small-12 columns center bold lottery_winner_table_box_container effect2"><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + t + '"> ' + e.previous_lambo_winner.userid + ' </div><div class="large-4 small-4 columns center bold lottery_winner_table_box lottery_winner_table_third_cell' + t + '"> <i class="fa fa-btc"></i>&nbsp;' + parseFloat(parseInt(e.previous_lambo_winner.amount) / 1e8).toFixed(8) + ' </div><div class="large-4 small-4 columns center bold lottery_winner_table_box lottery_winner_table_first_last_cell' + t + '"> ' + ReplaceNumberWithCommas(e.previous_lambo_winner.tickets_purchased) + " </div></div>")), $("#stats_page_tables").html(""), GenerateStatsTables("TOP 10 JACKPOT WINNERS", "ADDRESS", "JACKPOT AMOUNT", "FREE ROLLS", "MULTIPLY ROLLS", e.jackpot_winners, "stats_page_tables"), GenerateStatsTables("TOP 10 OVERALL WINNERS", "ADDRESS", "TOTAL WON", "FREE ROLLS", "MULTIPLY ROLLS", e.top_10_winners, "stats_page_tables"), GenerateStatsTables("TOP 10 AFFILIATES", "ADDRESS", "COMMISSIONS", "REFERRED", "SHARED", e.top_referrers, "stats_page_tables"), parimutuel_all_events_json = e;
            for (var n = '<option value="main">Select Category</option><option value="main">All</option><option value="popular">Popular</option><option value="new">New</option><option value="ending_soon">Ending Soon</option>', i = 0; i < e.categories.length; i++) n = n + '<option value="' + e.categories[i].code + '">' + e.categories[i].name + "</option>";
            n += '<option value="pending">Pending</option><option value="expired">Expired</option><option value="my_bets">My Bets</option><option value="my_expired_bets">My Expired Bets</option>', $("#betting_category_container").html(n);
            var s = getParameterByName("category");
            void 0 !== s && s.length > 0 ? ($("#betting_category_container").val(s), LoadParimutuelEvents(s)) : LoadParimutuelEvents("main"), wager_contest_winners = e.wager_contest_winners, lottery_previous_winners = e.lottery_previous_winners
        }
        initial_public_stats_loaded = 1
    })))
}

function GenerateStatsTables(e, t, a, o, n, i, s) {
    var r = '<div class="row" style="margin-top:20px;margin-bottom: 20px;"><div class="large-9 small-12 large-centered small-centered columns"><div class="large-12 small-12 columns center lottery_winner_table_box table_header_background br_5_5" style="padding: 15px 0;">' + e + "</div>";
    if (1 == mobile_device)
        for (var l = 0; l < i.length; l++) r = r + '<div class="new_stats_table_for_small"><div class="large-12 small-12 columns center lottery_winner_table_box_container effect2 multiply_history_table_header"><div class="large-3 small-6 columns center lottery_winner_table_box lottery_winner_table_first_last_cell font_bold">' + t + '</div><div class="large-3 small-6 columns center lottery_winner_table_box lottery_winner_table_second_cell font_bold">' + a + '</div><div class="large-3 small-6 columns center lottery_winner_table_box lottery_winner_table_first_last_cell">' + i[l].c1 + '</div> <div class="large-3 small-6 columns center lottery_winner_table_box lottery_winner_table_second_cell">' + i[l].c2 + '</div></div><div style="margin-bottom: 10px;"><div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-3 small-6 columns center lottery_winner_table_box lottery_winner_table_third_cell font_bold" style="border-left: 1px solid #ccc;">' + o + '</div><div class="large-3 small-6 columns center lottery_winner_table_box lottery_winner_table_first_last_cell font_bold">' + n + '</div><div class="large-3 small-6 columns center lottery_winner_table_box lottery_winner_table_third_cell" style="border-left: 1px solid #ccc;">' + i[l].c3 + '</div><div class="large-3 small-6 columns center lottery_winner_table_box lottery_winner_table_first_last_cell">' + i[l].c4 + '</div></div></div><div class="large-12 small-12 columns center" style="height:5px;"></div></div>';
    else {
        for (r = r + '<div class="new_stats_table_for_big"><div class="large-12 small-12 columns center lottery_winner_table_box_container effect2 multiply_history_table_header"><div class="large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_first_last_cell font_bold">' + t + '</div><div class="large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_second_cell font_bold">' + a + '</div><div class="large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_third_cell font_bold"><span>' + o + '</span></div><div class="large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_first_last_cell font_bold"><span>' + n + "</span></div></div>", l = 0; l < i.length; l++) r = r + '<div><div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_first_last_cell">' + i[l].c1 + '</div><div class="large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_second_cell">' + i[l].c2 + '</div><div class="large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_third_cell">' + i[l].c3 + '</div><div class="large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_first_last_cell">' + i[l].c4 + "</div></div></div>";
        r += "</div>"
    }
    r += "</div></div>", $("#" + s).append(r)
}

function InsertAlertMsg(e, t, a) {
    var o = 3650;
    if (a > 0 && (o = a), 1 != $.cookie("hide_" + e + "_msg")) {
        var n = '<div class="alert-box" id="' + e + '_msg" style="background-color:#FFFFAD;color:black;" align=center>' + t + '<a href="javascript:void(0);" class="close" onclick="CloseAlertMsg(\'' + e + "'," + o + ');">&times;</a></div>';
        $("#changing_rewards_link").after(n)
    }
}

function PreviousLotteryWinners(e) {
    if (e > 0)
        if (null == lottery_previous_winners) {
            InitialStatsLoad();
            var t = setInterval((function() {
                null != lottery_previous_winners && (clearInterval(t), PreviousLotteryWinners(e))
            }), 100)
        } else {
            var a = "";
            1 == mobile_device && (a = "lottery_table_mobile_style");
            for (var o = 1; o < 11; o++)
                for (var n = 0; n < lottery_previous_winners.length; n++)
                    if (lottery_previous_winners[n].rank == o && lottery_previous_winners[n].round == e) {
                        var i = parseFloat(Math.round(lottery_previous_winners[n].amount / 1e8 * 1e8) / 1e8).toFixed(8);
                        1 == lottery_previous_winners[n].rank && ($("#previous_lottery_winners_list_div").html('<div class="large-12 small-12 columns center lottery_winner_table_box table_header_background br_5_5"><div class="center" style="margin:auto;">LOTTERY ROUND ' + lottery_previous_winners[n].round + '</div></div><div class="large-12 small-12 columns center lottery_winner_table_box"><div class="center" style="margin:auto; font-weight:bold;">TOTAL TICKETS: ' + commaSeparateNumber(lottery_previous_winners[n].total_tickets) + '</div></div><div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="font_bold large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + a + '">#</div><div class="font_bold large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_second_cell' + a + '">USER ID</div><div class="font_bold large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell' + a + '">AMOUNT WON</div><div class="font_bold large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + a + '">USER TICKETS</div></div>'), lottery_winners_round_display = e), $("#previous_lottery_winners_list_div").append('<div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + a + '">' + lottery_previous_winners[n].rank + '</div><div class="large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_second_cell' + a + '">' + lottery_previous_winners[n].userid + '</div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell' + a + '">' + i + ' BTC</div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + a + '">' + commaSeparateNumber(lottery_previous_winners[n].tickets_purchased) + "</div> </div>")
                    }
        }
}

function PreviousContestWinners(e) {
    if (e > 0)
        if (null == wager_contest_winners) {
            InitialStatsLoad();
            var t = setInterval((function() {
                null != wager_contest_winners && (clearInterval(t), PreviousContestWinners(e))
            }), 100)
        } else {
            var a = "";
            1 == mobile_device && (a = "lottery_table_mobile_style");
            for (var o = 1; o < 11; o++)
                for (var n = 0; n < wager_contest_winners.length; n++)
                    if (wager_contest_winners[n].rank == o && wager_contest_winners[n].round == e)
                        if ("wager" == wager_contest_winners[n].contest_type) {
                            1 == wager_contest_winners[n].rank && ($(".prev_contest_round_title").html("CONTEST ROUND " + e + " WINNERS"), $("#wager_contest_round_display").html(e), wagering_contest_winners_round_display = e, $("#contest_winner_table_user_list").html('<div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="font_bold large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_first_last_cell gold ' + a + '"> # </div><div class="font_bold large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_second_cell gold ' + a + '"> USERID </div><div class="font_bold large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell gold ' + a + '"> AMOUNT WON </div><div class="font_bold large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell gold ' + a + '"> WAGERED </div></div>'));
                            var i = parseFloat(Math.round(wager_contest_winners[n].prize / 1e8 * 1e8) / 1e8).toFixed(8),
                                s = parseFloat(Math.round(wager_contest_winners[n].wagered / 1e8 * 1e8) / 1e8).toFixed(8);
                            $("#contest_winner_table_user_list").append('<div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + a + '"> ' + wager_contest_winners[n].rank + ' </div><div class="large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_second_cell ' + a + '"> ' + wager_contest_winners[n].userid + ' </div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell ' + a + '"> <i class="fa fa-btc" aria-hidden="true"></i> ' + i + '</div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + a + '"> <i class="fa fa-btc" aria-hidden="true"></i> ' + s + " </div></div>")
                        } else "ref" == wager_contest_winners[n].contest_type && (1 == wager_contest_winners[n].rank && ($(".prev_contest_round_title").html("CONTEST ROUND " + e + " WINNERS"), $("#wager_contest_round_display").html(e), wagering_contest_winners_round_display = e, $("#contest_winner_table_referrer_list").html('<div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="font_bold large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_first_last_cell gold ' + a + '"> # </div><div class="font_bold large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_second_cell gold ' + a + '"> USERID </div><div class="font_bold large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell gold ' + a + '"> AMOUNT WON </div><div class="font_bold large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell gold ' + a + '"> REF. WAGERED </div></div>')), i = parseFloat(Math.round(wager_contest_winners[n].prize / 1e8 * 1e8) / 1e8).toFixed(8), s = parseFloat(Math.round(wager_contest_winners[n].wagered / 1e8 * 1e8) / 1e8).toFixed(8), $("#contest_winner_table_referrer_list").append('<div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-1 small-1 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + a + '"> ' + wager_contest_winners[n].rank + ' </div><div class="large-3 small-3 columns center lottery_winner_table_box lottery_winner_table_second_cell ' + a + '"> ' + wager_contest_winners[n].userid + ' </div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell ' + a + '"> <i class="fa fa-btc" aria-hidden="true"></i> ' + i + '</div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + a + '"> <i class="fa fa-btc" aria-hidden="true"></i> ' + s + " </div></div>"))
        }
}

function CloseAlertMsg(e, t) {
    var a = 3650;
    t > 0 && (a = t), $("#" + e + "_msg").hide(), $.cookie.raw = !0, $.cookie("hide_" + e + "_msg", 1, {
        expires: a,
        secure: !0,
        path: "/"
    })
}

function RenewCookies() {
    var e = ["mobile", "login_auth", "referrer", "tag", "btc_address", "password", "have_account", "free_play_sound", "hide_earn_btc_msg", "hide_mine_btc_msg", "default_captcha", "userid", "fbtc_session", "fbtc_userid"];
    $.cookie.raw = !0;
    for (var t = 0; t < e.length; t++) {
        var a = $.cookie(e[t]);
        null != a && $.cookie(e[t], a, {
            expires: 3650,
            secure: !0,
            path: "/"
        })
    }
}

function changeContainerDiv_parimutuel() {
    $("body").innerWidth() < 990 && $("body").innerWidth() > 767 ? ($("#main_content").addClass("large-12"), $("#main_content").removeClass("large-9")) : ($("#main_content").addClass("large-9"), $("#main_content").removeClass("large-12"))
}

function changeContainerDiv_others_parimutuel() {
    $("#main_content").addClass("large-9"), $("#main_content").removeClass("large-12")
}

function change_box_size_parimutuel() {
    $("body").innerWidth() < 990 && $("body").innerWidth() > 767 && ($(".timer_span_for_768_up").addClass("timer_span_width_for_768_up"), $(".timer_div_for_768_up").addClass("timer_div_width_for_768_up"), $(".countdown_row").addClass("countdown_row_for_768_up")), $("body").innerWidth() > 989 && ($(".timer_span_for_768_up").removeClass("timer_span_width_for_768_up"), $(".timer_div_for_768_up").removeClass("timer_div_width_for_768_up"), $(".countdown_row").removeClass("countdown_row_for_768_up")), $("body").innerWidth() < 768 && ($(".timer_span_for_768_up").removeClass("timer_span_width_for_768_up"), $(".timer_div_for_768_up").removeClass("timer_div_width_for_768_up"), $(".countdown_row").removeClass("countdown_row_for_768_up"), $(".bets_change_timer_container_size").addClass("large-12"), $(".bets_change_timer_container_size").removeClass("large-7")), $("body").innerWidth() < 1041 && $("body").innerWidth() > 767 && ($(".change_size_medium_left").addClass("large-12"), $(".change_size_medium_left").removeClass("large-5"), $(".change_size_medium_right").addClass("large-12"), $(".change_size_medium_right").removeClass("large-7")), $("body").innerWidth() > 1041 && ($(".change_size_medium_left").addClass("large-5"), $(".change_size_medium_left").removeClass("large-12"), $(".change_size_medium_right").addClass("large-7"), $(".change_size_medium_right").removeClass("large-12"), $(".change_size_medium_left").addClass("reward_table_box_left"), $(".change_size_medium_left").removeClass("reward_table_box_left_mobile"), $(".change_size_medium_right").addClass("reward_table_box_right"), $(".change_size_medium_right").removeClass("reward_table_box_right_mobile")), $("body").innerWidth() < 1041 && ($(".change_size_medium_left").addClass("reward_table_box_left_mobile"), $(".change_size_medium_left").removeClass("reward_table_box_left"), $(".change_size_medium_right").addClass("reward_table_box_right_mobile"), $(".change_size_medium_right").removeClass("reward_table_box_right"))
}

function ParimutuelPlaceBet(e, t) {
    var a = $("#parimutuel_outcome_" + e + "_" + t + "_li .parimutuel_bet_amount").val();
    $.get("/cgi-bin/api.pl?op=parimutuel_bet&game_id=" + e + "&outcome=" + t + "&bet_amount=" + a, (function(e) {
        if (DisplaySEMessage(e.status, e.msg), "s" == e.status) {
            $("#balance").html(e.balance), balanceChanged();
            var t = e.outcome_name,
                a = parseFloat(e.bet_amount).toFixed(8),
                o = "";
            $("body").innerWidth() < 768 && (o = " lottery_table_mobile_style ");
            var n = '<div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + o + '">' + t + '</div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell' + o + '">' + a + '</div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + o + '"><font color=red>0.00000000</font></div> </div>';
            $("#parimutuel_game_container_page .parimutuel_bet_history_table").prepend(n)
        }
    }))
}

function OpenParimutuelGame(e) {
    if ("success" == parimutuel_all_events_json.status)
        for (var t = 0; t < parimutuel_all_events_json.details.length; t++)
            if (parimutuel_all_events_json.details[t].game_id == e) {
                $("#parimutuel_main_page_div").hide(), $("#parimutuel_page_main_text").hide(), $("#parimutuel_game_container_page").show(), $("#parimutuel_back_to_all_events_button_div").show();
                var a = parseFloat(parseInt(parimutuel_all_events_json.details[t].game_pot) / 1e8).toFixed(8),
                    o = Math.floor((new Date).getTime() / 1e3),
                    n = parseInt(parimutuel_all_events_json.details[t].bets_paused) - o,
                    i = "ENDING IN",
                    s = '<div class="hasCountdown" style="margin: auto; width: 240px !important; padding: 11px 0; background-color: transparent !important; border: none !important;"><div class="countdown_row countdown_show4 time_remaining_' + parimutuel_all_events_json.details[t].game_id + '" style="height: 30px !important; border: 0 !important; background: transparent !important;"></div></div>',
                    r = '<div class="large-5 large-centered small-12 small-centered columns" style="margin: 20px auto;"><div class="reward_table_box gold br_5_5 bold" style="border-bottom: 1px solid #f3cd00; font-weight: bold; text-align: center; padding-left: 10px;">TIME WEIGHT MULTIPLIER<a class="auto_bet_setting_span" style="float: right; color: black; border: 1px solid #000;padding: 5px;" href="javascript:void(0);" data-reveal-id="time_weight_modal">?</a></div><div class="reward_table_box br_0_0_5_5" style="border-top:none; padding: 15px;"><span style="font-size: 25px; font-weight: 900; color: #000; text-shadow: 0px 0px 5px #fff;" class="parimutuel_time_weight_' + parimutuel_all_events_json.details[t].game_id + '">&nbsp;' + parimutuel_all_events_json.details[t].time_weight + "x</span> </div></div>";
                if (parimutuel_all_events_json.details[t].paid_out > 0) {
                    for (var l = 0; l < parimutuel_all_events_json.details[t].outcomes.length; l++) parimutuel_all_events_json.details[t].outcomes[l].outcome == parimutuel_all_events_json.details[t].winner && (b = parimutuel_all_events_json.details[t].outcomes[l].name);
                    i = "WINNER", s = '<div class="hasCountdown" style="margin: auto; width: 240px !important; padding: 11px 0; background-color: transparent !important; border: none !important;"><span style="font-size: 25px; font-weight: 900; color: blue; text-shadow: 0px 0px 5px #fff;">' + b + "</span></div>"
                }
                n < 1 && (r = "");
                var _ = '<div class="row" style="margin:0; padding:0;"><div class="row"><div class="large-12 large-centered columns"><h3 style="width: 320px; margin-right: auto; margin-left: auto; text-align: center;text-transform: uppercase;"><u>' + parimutuel_all_events_json.details[t].name + "</u></h3><p>" + parimutuel_all_events_json.details[t].game_summary + '</p></div></div><div class="large-5 large-centered small-12 small-centered columns" style="margin-top: 20px;"><div class="reward_table_box gold br_5_5 bold" style="border-bottom: 1px solid #f3cd00; font-weight: bold; text-align: center; padding-left: 10px;">' + i + '</div><div class="reward_table_box br_0_0_5_5" style="border-top:none; padding: 10px;">' + s + "</div></div>" + r + '<div class="large-5 large-centered small-12 small-centered columns" style="margin: 20px auto;"><div class="reward_table_box gold br_5_5 bold" style="border-bottom: 1px solid #f3cd00; font-weight: bold; text-align: center; padding-left: 10px;">PRIZE POOL</div><div class="reward_table_box br_0_0_5_5" style="border-top:none; padding: 15px;"><i class="fa fa-btc" style="font-size: 25px; font-weight: 900; color: #008600; text-shadow: 0px 0px 5px #fff;"></i>&nbsp;<span style="font-size: 25px; font-weight: 900; color: #008600; text-shadow: 0px 0px 5px #fff;" class="parimutuel_prize_pool_' + parimutuel_all_events_json.details[t].game_id + '">' + a + '</span></div></div><div class="large-12 large-centered columns betting_container_for_768_up"><ul class="small-block-grid-1 medium-block-grid-3 large-block-grid-3 center">';
                for (l = 0; l < parimutuel_all_events_json.details[t].outcomes.length; l++) {
                    var c = parseInt(parimutuel_all_events_json.details[t].outcomes[l].popularity);
                    c > 100 && (c = 100);
                    var d = "red";
                    c > 24 && c < 50 ? d = "orange" : c > 49 && c < 75 ? d = "yellow" : c > 74 && (d = "green"), _ = _ + '<li style="padding: 10px;" id="parimutuel_outcome_' + parimutuel_all_events_json.details[t].game_id + "_" + parimutuel_all_events_json.details[t].outcomes[l].outcome + '_li"><div style="height: auto; border: 2px solid white; box-shadow: 0 0 5px black; padding-bottom:20px; background: transparent;"><div class="center reward_table_box table_header_background" style="padding: 10px; font-size: 15px; font-weight: 900;">' + parimutuel_all_events_json.details[t].outcomes[l].name + '</div><div class="large-12 large-centered small-12 small-centered columns" style="margin: 20px 0;"><div class="reward_table_box gold br_5_5 bold" style="border-bottom: 1px solid #f3cd00; font-weight: bold; text-align: center; padding: 5px;">BETS COUNT</div><div class="reward_table_box br_0_0_5_5 parimutuel_outcome_bets_count" style="border-top:none; padding: 10px;">' + commaSeparateNumber(parseInt(parimutuel_all_events_json.details[t].outcomes[l].bets_count)) + '</div></div><div class="large-12 large-centered small-12 small-centered columns" style="margin: 20px 0;"><div class="reward_table_box gold br_5_5 bold" style="border-bottom: 1px solid #f3cd00; font-weight: bold; text-align: center; padding: 5px;">OUTCOME ODDS<a class="auto_bet_setting_span" style="float: right; margin-top: 3px; color: black; border: 1px solid #000;">?<span style="right: 15px; max-width: 280px; font-weight: normal;">Estimated odds for this outcome. Actual odds will be calculated after betting ends for this event.</span></a></div><div class="reward_table_box br_0_0_5_5 parimutuel_outcome_bet_odds" style="border-top:none; padding: 10px;">' + parimutuel_all_events_json.details[t].outcomes[l].odds + '</div></div><div class="large-10 large-centered small-12 small-centered progress_bar_container_div"><p class="' + d + '_progress_bar" style="width: ' + c + '%;"> </p><span style="width: 100%; position: absolute; top:0; left: 0; background-color: transparent; text-align: center; padding-top: 4px; font-weight: 900;">' + c + '%</span></div><div class="large-12 small-12 columns center reward_table_box reward_table_box_container" style="margin: 9px 0; border:none; background: transparent;" ><div class="large-12 small-12 columns center reward_table_box reward_table_box_left_mobile bronze" style="border: 1px solid #d87310;padding: 7px 0;">BET AMOUNT</div><div class="row" style="margin:0; padding:0;"><div class="large-12 small-12 columns center reward_table_input reward_table_box_right_mobile" style="background: transparent;"><div class="large-2 small-4 columns" style="background: #f2f2f2; height: 2.3125em; padding: 4px; border: 1px solid #ccc; border-right: none;"><i class="fa fa-btc" style="text-align: center;"></i></div><div class="large-10 small-8 columns" style="padding: 0;"><input type="text" style="text-align: center; color: #000; border-radius:0 0 3px 3px;" class="parimutuel_bet_amount" placeholder="Enter Bet Amount" onfocus="javascript:ParimutuelFocus(\'' + parimutuel_all_events_json.details[t].game_id + "','" + parimutuel_all_events_json.details[t].outcomes[l].outcome + "');\" onkeypress=\"javascript:ParimutuelFocus('" + parimutuel_all_events_json.details[t].game_id + "','" + parimutuel_all_events_json.details[t].outcomes[l].outcome + "');\" onkeydown=\"javascript:ParimutuelFocus('" + parimutuel_all_events_json.details[t].game_id + "','" + parimutuel_all_events_json.details[t].outcomes[l].outcome + "');\" onkeyup=\"javascript:ParimutuelFocus('" + parimutuel_all_events_json.details[t].game_id + "','" + parimutuel_all_events_json.details[t].outcomes[l].outcome + '\');"></div> </div></div><div class="row parimutuel_estimated_winnings" style="margin-top: 1px; padding:0;"><div class="large-12 small-12 columns large-centered small-centered center" style="width:auto;"><p class="odd_win_chance_message" style="display: block;">Estimated winnings:&nbsp;<span style="overflow: hidden;white-space: nowrap;"><i class="fa fa-btc"></i>0.00000000</span></p></div></div></div><button class="auto_bet_start_stop_button" id="got_play_now" style="padding:10px;" onclick="javascript:ParimutuelPlaceBet(\'' + parimutuel_all_events_json.details[t].game_id + "','" + parimutuel_all_events_json.details[t].outcomes[l].outcome + "');\">&nbsp;&nbsp;&nbsp;BET&nbsp;&nbsp;&nbsp;</button></div></li> "
                }
                _ += "</ul> </div></div>", _ += '<div class="large-7 large-centered small-12 small-centered columns" style="margin-top: 20px;"><div class="reward_table_box gold br_5_5 bold" style="border-bottom: 1px solid #f3cd00; font-weight: bold; text-align: left; padding-left: 10px;">DECISION LOGIC</div><div class="reward_table_box br_0_0_5_5 font_bold" style="border-top:none; padding: 10px;">';
                var u = parimutuel_all_events_json.details[t].game_logic.split("|");
                for (l = 0; l < u.length; l++) _ = _ + '<p style="margin:0; text-transform: none; text-align: left;">' + u[l] + "</p>";
                if (_ += "</div></div>", $("#parimutuel_game_container_page").html(_), $(".time_remaining_" + parimutuel_all_events_json.details[t].game_id).countdown({
                        until: +n,
                        format: "DHMS"
                    }), change_box_size_parimutuel(), $("html, body").animate({
                        scrollTop: 0
                    }, "fast"), parimutuel_bet_history_json.length > 0) {
                    var p = "";
                    for ($("body").innerWidth() < 768 && (p = " lottery_table_mobile_style "), _ = '<div class="row" style="margin-top:20px;margin-bottom: 20px;"><div class="large-7 small-12 large-centered small-centered columns change_size_css"><div class="large-12 small-12 columns center lottery_winner_table_box table_header_background br_5_5"><div class="center" style="margin:auto;">YOUR BETS ON THIS EVENT</div></div><div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + p + '"> <span class="bold">OUTCOME</span> </div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell ' + p + '"> <span class="bold">BET</span> </div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell ' + p + '"> <span class="bold">WINNINGS</span> </div></div><div class="parimutuel_bet_history_table">', l = 0; l < parimutuel_bet_history_json.length; l++)
                        if (parimutuel_bet_history_json[l].game_id == e) {
                            for (var b, m = 0; m < parimutuel_all_events_json.details[t].outcomes.length; m++) parimutuel_all_events_json.details[t].outcomes[m].outcome == parimutuel_bet_history_json[l].outcome && (b = parimutuel_all_events_json.details[t].outcomes[m].name);
                            var h = parseFloat(parimutuel_bet_history_json[l].bet_amount / 1e8).toFixed(8),
                                f = parseFloat(parimutuel_bet_history_json[l].winnings / 1e8).toFixed(8);
                            _ = _ + '<div class="large-12 small-12 columns center lottery_winner_table_box_container effect2"><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + p + '">' + b + '</div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_third_cell' + p + '">' + h + '</div><div class="large-4 small-4 columns center lottery_winner_table_box lottery_winner_table_first_last_cell' + p + '">' + (f = f < 1e-8 ? "<font color=red>" + f + "</font>" : "<font color=green>" + f + "</font>") + "</div> </div>"
                        } _ += "</div></div></div><p>Your bets will appear here within 1 hour of being placed.</p>", $("#parimutuel_game_container_page").append(_)
                }
            }
}

function ParimutuelFocus(e, t) {
    var a = parseFloat($("#parimutuel_outcome_" + e + "_" + t + "_li .parimutuel_bet_amount").val()),
        o = parseFloat($("#parimutuel_outcome_" + e + "_" + t + "_li .parimutuel_outcome_bet_odds").html()),
        n = parseFloat(a * o * 1e8 / 1e8).toFixed(8);
    1 == isNaN(n) && (n = "0.00000000"), $("#parimutuel_outcome_" + e + "_" + t + "_li .parimutuel_estimated_winnings").html('<div class="large-12 small-12 columns large-centered small-centered center" style="width:auto;"><p class="odd_win_chance_message" style="display: block;">Estimated winnings:&nbsp;<span style="overflow: hidden;white-space: nowrap;"><i class="fa fa-btc"></i>' + n + "</span></p></div>")
}

function LoadParimutuelEvents(e) {
    $("#please_wait_loading_page").hide(), $("#parimutuel_main_page_ul").html("");
    var t = JSON.parse(JSON.stringify(parimutuel_all_events_json));
    "expired" == e || "my_expired_bets" == e || "ending_soon" == e ? (t.details.sort((function(e, t) {
        return e.bets_paused.toString().localeCompare(t.bets_paused.toString())
    })), "expired" != e && "my_expired_bets" != e || t.details.reverse()) : "new" == e ? (t.details.sort((function(e, t) {
        return e.starts.toString().localeCompare(t.starts.toString())
    })), t.details.reverse()) : "popular" == e ? (t.details.sort((function(e, t) {
        return e.game_pot.toString().localeCompare(t.game_pot.toString())
    })), t.details.reverse()) : t = parimutuel_all_events_json;
    for (var a = 0, o = 0, n = 0, i = 0; i < t.details.length; i++) {
        var s = parseFloat(parseInt(t.details[i].game_pot) / 1e8).toFixed(8),
            r = Math.floor((new Date).getTime() / 1e3),
            l = parseInt(t.details[i].bets_paused) - r,
            _ = r - parseInt(t.details[i].starts),
            c = '<div class="countdown_row countdown_show4 time_remaining_' + t.details[i].game_id + '" style="height:61px;"></div>',
            d = 0;
        if ("main" == e) l > 0 && (d = 1);
        else {
            if (e == t.details[i].category && l > 0 && (d = 1), "popular" == e && l > 0 && (s > .5 || o < 12) && (d = 1, o += 1), "ending_soon" == e && _ > 0 && l > 0 && (l < 86400 || n < 12) && (d = 1, n += 1), "new" == e && _ > 0 && l > 0 && (_ < 86400 || a < 12) && (d = 1, a += 1), "my_bets" == e && l > 0)
                for (var u = 0; u < parimutuel_bet_history_json.length; u++) parimutuel_bet_history_json[u].game_id == t.details[i].game_id && (d = 1);
            if (l < 0)
                if ("pending" == e && t.details[i].paid_out < 1) d = 1, c = '<div class="countdown_row countdown_show4"><span style="font-size: 25px; font-weight: 900; color: red; text-shadow: 0px 0px 5px #fff;">PENDING</span></div>';
                else if ("expired" == e && t.details[i].paid_out > 0) d = 1, c = '<div class="countdown_row countdown_show4"><span style="font-size: 25px; font-weight: 900; color: blue; text-shadow: 0px 0px 5px #fff;">PAID OUT</span></div>';
            else if ("my_expired_bets" == e)
                for (u = 0; u < parimutuel_bet_history_json.length; u++) parimutuel_bet_history_json[u].game_id == t.details[i].game_id && (d = 1, c = t.details[i].paid_out < 1 ? '<div class="countdown_row countdown_show4"><span style="font-size: 25px; font-weight: 900; color: red; text-shadow: 0px 0px 5px #fff;">PENDING</span></div>' : '<div class="countdown_row countdown_show4"><span style="font-size: 25px; font-weight: 900; color: blue; text-shadow: 0px 0px 5px #fff;">PAID OUT</span></div>')
        }
        1 == d && ($("#parimutuel_main_page_ul").append('<li style="padding: 10px;"><div style="height: auto; border: 2px solid white; box-shadow: 0 0 5px black; padding-bottom:20px; background: transparent;"><div class="center reward_table_box table_header_background" style="padding: 10px; font-size: 15px; font-weight: 900;text-transform: uppercase;">' + t.details[i].name + '</div><div style="background-image: url(' + t.details[i].bg_image + ');background-repeat: no-repeat;background-size: cover;"><img src="' + t.details[i].fg_image + '"></img></div><p style="color: black; font-weight: 500; border-bottom: 1px solid #ccc; margin: 0; padding: 4px; text-align: left; font-size: 15px;">' + t.details[i].game_summary + '</p><div class="large-12 large-centered small-12 small-centered columns" style="margin: 20px 0;"><div class="reward_table_box gold br_5_5 bold" style="border-bottom: 1px solid #f3cd00; font-weight: bold; text-align: center; padding: 9px;">PRIZE POOL</div><div class="reward_table_box br_0_0_5_5" style="border-top:none; padding: 10px; background: transparent !important;"><i class="fa fa-btc" style="font-size: 25px; font-weight: 900; color: #008600;"></i>&nbsp;<span style="font-size: 25px; font-weight: 900; color: #008600; text-shadow: 0px 0px 5px #fff;" class="parimutuel_prize_pool_' + t.details[i].game_id + '">' + s + '</span></div></div><div class="hasCountdown timer_div_for_768_up" style="margin: auto; width: auto; padding: 0; margin-top: 10px; background-color: transparent !important; height: 105px !important;"><div class="gold" style="font-weight: bold; text-align: center; font-size: 15px; padding: 9px;">ENDING IN</div>' + c + '</div><button class="auto_bet_start_stop_button" onclick="javascript:OpenParimutuelGame(\'' + t.details[i].game_id + '\')" style="padding:10px; margin-top: 10px;">BET NOW</button> </div></li>'), $(".time_remaining_" + t.details[i].game_id).countdown({
            until: +l,
            format: "DHMS"
        })), change_box_size_parimutuel()
    }
}

function showSelectedBettingCategory() {
    LoadParimutuelEvents($("#betting_category_container").val())
}

function ClosePromoBanner() {
    $("#deposit_promo_message_mobile").hide(), $("#deposit_promo_message_regular").hide()
}

function CloseDailyJPBanner() {
    $(".daily_jackpot_main_container_div").hide()
}

function GenerateCaptchasNetCaptcha(e, t, a) {
    void 0 !== a && a.length > 5 && a.length < 100 ? GenCaptchasNetCaptcha(e, t, a) : $.get("/cgi-bin/api.pl?op=generate_captchasnet&f=" + fingerprint, (function(a) {
        a.length < 100 && GenCaptchasNetCaptcha(e, t, a)
    }))
}

function GenCaptchasNetCaptcha(e, t, a) {
    e = e.replace(/\s/g, "");
    var o = "//captchas.freebitco.in/cgi-bin/captcha_generator?client=freebitcoin&random=" + a;
    2 == t ? o = "//captchas.freebitco.in/securimage/securimage/securimage_show.php?random=" + a : 3 == t && (o = "//captchas.freebitco.in/botdetect/e/live/index.php?random=" + a), $("#" + e + " .captchasnet_captcha_content").html('<img src="' + o + '" onerror="GenerateCaptchasNetCaptcha(\'' + e + "', " + t + ", '" + a + "');\">"), $("#" + e + " .captchasnet_captcha_random").val(a), $("#" + e + " .captchasnet_captcha_refresh").attr("onclick", "GenerateCaptchasNetCaptcha('" + e + "', " + t + ")"), $("#" + e + " .captchasnet_captcha_audio").attr("onclick", "PlayCaptchasNetAudioCaptcha('" + a + "')"), $("#" + e + " .captchasnet_captcha_input_box").val("")
}

function PriceChart(e) {
    var t = {
            labels: thirty_day_arr_time,
            datasets: [{
                label: "FUN/USD",
                borderColor: "#26ca4a",
                backgroundColor: "#26ca4a",
                fill: !1,
                data: thirty_day_arr_usd,
                yAxisID: "y-axis-2"
            }]
        },
        a = document.getElementById(e).getContext("2d"),
        o = {
            data: t,
            options: {
                responsive: !0,
                hoverMode: "index",
                stacked: !1,
                spanGaps: !0,
                animation: !1,
                title: {
                    display: !0,
                    text: "FUN PRICE 30 DAY CHART"
                },
                scales: {
                    yAxes: [{
                        type: "linear",
                        display: !0,
                        position: "right",
                        id: "y-axis-2"
                    }],
                    xAxes: [{
                        gridLines: {
                            color: "white"
                        },
                        ticks: {
                            display: !1
                        }
                    }]
                },
                elements: {
                    point: {
                        radius: 0
                    },
                    line: {
                        fill: !1,
                        stepped: !1,
                        borderDash: []
                    }
                }
            }
        };
    myChart && myChart.destroy(), myChart = Chart.Line(a, o)
}

function UpdateFunPrice() {
    $.get("/stats_new_private/?u=" + socket_userid + "&p=" + socket_password + "&f=get_fun_price", (function(e) {
        if ("success" == e.status) {
            user_fun_balance = parseInt(e.fun_balance), user_unlocked_fun_balance = parseInt(e.unlocked_fun_balance), user_locked_fun_balance = parseInt(e.locked_fun_balance), user_fun_cb = parseFloat(e.fun_cb), fun_price_btc = parseFloat(e.fun_price).toFixed(8), fun_sell_price_btc = parseFloat(e.fun_sell_price).toFixed(8), balanceChanged(), $("#fun_buy_price").html(fun_price_btc), $("#fun_sell_price").html(fun_sell_price_btc);
            var t = "";
            1 == mobile_device && (t = " lottery_table_mobile_style ");
            var a = {
                btc_profit: 0,
                per_profit: 0,
                btc_value: 0
            };
            if (e.fun_balance > 0 && e.fun_btc_spent > 0 && e.fun_price > 0 && e.fun_balance - e.net_fun_deposits > 0 && (a.btc_profit = parseFloat(((e.fun_balance - e.net_fun_deposits) * (1e8 * e.fun_price) - (e.fun_btc_spent - e.fun_refund_given)) / 1e8).toFixed(8), a.per_profit = parseFloat(1e8 * a.btc_profit / (e.fun_btc_spent - e.fun_refund_given) * 100).toFixed(2)), a.per_profit < 0 ? a.per_profit = '<span style="color:red">' + a.per_profit + "%</span>" : a.per_profit = '<span style="color:green">+' + a.per_profit + "%</span>", e.fun_withdraw_fee > 0 && (f_w_fee = e.fun_withdraw_fee, $("#fun_withdraw_fee").html(f_w_fee)), e.fun_balance < 2500 && ($("#free_play_fun_no_captcha_msg").html('<p class="bold"><a href="javascript:void(0);" onclick="SwitchPageTabs(\'loyalty_token\');" style="color:white;">Buy and hold 2,500 FUN tokens in your account to play FREE BTC with NO CAPTCHA!</a></p>'), $("#free_play_fun_no_captcha_msg").show()), a.per_profit > 0 && (a.btc_profit = "+" + a.per_profit), user_fun_balance > 0) {
                a.btc_value = parseFloat(user_fun_balance * fun_sell_price_btc).toFixed(8);
                var o = '<div class="large-6 small-12 large-centered small-centered columns change_size_css"><div class="large-12 small-12 columns center lottery_winner_table_box_container my_tickets_row_one"><div class="large-6 small-6 columns center table_header_background lottery_winner_table_box ' + t + '" style="border-radius: 5px 0 0 0;"> YOUR TOKENS (LOCKED)</div><div class="large-6 small-6 columns center table_header_background lottery_winner_table_box ' + t + '" style="border-radius: 0 5px 0 0;"> BTC VALUE </div></div><div class="large-12 small-12 columns center lottery_winner_table_box_container my_tickets_row_two "><div class="large-6 small-6 columns center lottery_winner_table_box lottery_winner_table_first_last_cell font_bold ' + t + '" style="border-radius: 0 0 0 5px;"> ' + ReplaceNumberWithCommas(user_unlocked_fun_balance) + " (" + ReplaceNumberWithCommas(user_locked_fun_balance) + ')</div><div class="large-6 small-6 columns center lottery_winner_table_box lottery_winner_table_first_last_cell font_bold ' + t + '" style="border-radius: 0 0 5px 0;">' + a.btc_value + "</div></div></div> ";
                $("#user_fun_stats").html(o), $("#user_fun_stats").show()
            }
            user_unlocked_fun_balance > 500 && $("#savings_fun_to_lock").val(user_unlocked_fun_balance).trigger("input");
            var n = "";
            if (user_fun_cb > 0 && (n = 'YOU ARE RECEIVING <span style="color:green;">' + user_fun_cb + "% CASHBACK</span> ON ALL YOUR BETS!<BR>"), user_fun_balance < 5e5) {
                for (var i = -1, s = 0; s < token_tiers.length; s++) user_fun_balance >= token_tiers[s] && (i = s);
                var r = token_tiers[i + 1],
                    l = r - user_fun_balance,
                    _ = fun_benefit_tiers_new[r][360].wof,
                    c = fun_benefit_tiers_new[r][360].int,
                    d = fun_benefit_tiers_new[r][360].cb;
                $(".premium_buy_more_tokens").show(), $(".buy_more_tokens_text").html('BUY <span style="color:red;">' + ReplaceNumberWithCommas(l) + '</span> FUN TOKENS TO GET <span style="color:blue;">' + _ + ' FREE WOF SPINS</span> DAILY, <span style="color:green;">' + c + '% INTEREST BOOST</span> AND <span style="color:#eb3434;">' + d + "% CASHBACK</span> ON ALL YOUR WAGERS!"), $("#buy_more_tokens_int_text").html('BUY <span style="color:red;">' + ReplaceNumberWithCommas(l) + '</span> FUN TOKENS TO GET <span style="color:blue;">' + c + "% MORE INTEREST</span> ON YOUR BALANCE!"), $(".buy_more_tokens_multiply_text").html(n + 'BUY <span style="color:red;">' + ReplaceNumberWithCommas(l) + '</span> FUN TOKENS TO GET <span style="color:blue;">' + d + "% CASHBACK ON YOUR BETS</span>!"), $("#buy_fun_count").val(l)
            } else $(".buy_more_tokens_multiply_text").html(n), $(".premium_user_cb_box").show();
            RecalculateFUNBenefitsBuyBox(), FUNPPriceLockTimer()
        }
    }))
}

function FUNPPriceLockTimer() {
    clearInterval(price_lock_interval);
    var e = 60;
    price_lock_interval = setInterval((function() {
        --e >= 0 && ($(".price_lock_timer").html("Price valid for: " + e + " sec"), $(".price_lock_timer").show()), 0 === e && clearInterval(price_lock_interval)
    }), 1e3)
}

function BenefitsSliderChange(e) {
    $("#benefits_calculator_slider").val(e), $("#buy_fun_count").val(e), $("#benefits_slider_table").html('<tr><td class="text-center">1 Day</td><td>' + fun_benefit_tiers_new[e][1].cb + "%</td><td>" + fun_benefit_tiers_new[e][1].int + "%</td><td>" + fun_benefit_tiers_new[e][1].wof + '</td></tr><tr><td class="text-center">30 Days</td><td>' + fun_benefit_tiers_new[e][30].cb + "%</td><td>" + fun_benefit_tiers_new[e][30].int + "%</td><td>" + fun_benefit_tiers_new[e][30].wof + '</td></tr><tr><td class="text-center">90 Days</td><td>' + fun_benefit_tiers_new[e][90].cb + "%</td><td>" + fun_benefit_tiers_new[e][90].int + "%</td><td>" + fun_benefit_tiers_new[e][90].wof + '</td></tr><tr><td class="text-center">180 Days</td><td>' + fun_benefit_tiers_new[e][180].cb + "%</td><td>" + fun_benefit_tiers_new[e][180].int + "%</td><td>" + fun_benefit_tiers_new[e][180].wof + '</td></tr><tr><td class="text-center">360 Days</td><td>' + fun_benefit_tiers_new[e][360].cb + "%</td><td>" + fun_benefit_tiers_new[e][360].int + "%</td><td>" + fun_benefit_tiers_new[e][360].wof + "</td></tr>")
}

function RecalculateFUNBenefitsBuyBox() {
    var e = parseInt($("#buy_fun_count").val()),
        t = parseFloat(e * fun_price_btc).toFixed(8),
        a = parseFloat(e * fun_sell_price_btc).toFixed(8);
    $("#buy_fun_total_amt").html(t), $("#sell_fun_total_amt").html(a);
    var o = 0;
    for (const t in fun_benefit_tiers_new) e + user_fun_balance >= t && (o = t);
    var n = "",
        i = "";
    $("body").innerWidth() < 728 && (n = '</p><div class="row" style="margin-top:20px;"><p>', i = "</p></div>"), $("#buy_fun_benefit_boxes").html('<p><span class="free_play_bonus_box_span_large" style="padding:15px;">' + fun_benefit_tiers_new[o][360].cb + '% Cashback</span><span class="free_play_bonus_box_span_large" style="padding:15px;">' + fun_benefit_tiers_new[o][360].wof + " WOF spins/day</span>" + n + '<span class="free_play_bonus_box_span_large" style="padding:15px;">' + fun_benefit_tiers_new[o][360].int + "% Interest Boost</span>" + i + "</p>"), fun_buy_lock_time_dropdown()
}

function OpenRefPopup() {
    SwitchPageTabs("loyalty_token")
}

function fun_buy_sell_option() {
    var e = $("#fun_buy_sell_dropdown").val();
    "buy" == e ? ($(".fun_buy_stuff").show(), $(".fun_sell_stuff").hide()) : "sell" == e && ($(".fun_buy_stuff").hide(), $(".fun_lock_stuff").hide(), $(".fun_sell_stuff").show(), $("#fun_buy_lock_time_dropdown").val(0))
}

function fun_savings_time_dropdown() {
    var e = $("#fun_savings_time_dropdown").val();
    15 != e && 30 != e && 90 != e && 180 != e && 360 != e || ($("#fun_savings_apy").html(fun_savings_apy[e]), RecalculateFUNSavingsMaturity())
}

function fun_buy_lock_time_dropdown() {
    var e = $("#fun_buy_lock_time_dropdown").val(),
        t = parseInt($("#buy_fun_count").val());
    if (15 == e || 30 == e || 90 == e || 180 == e || 360 == e)
        if ($(".fun_lock_stuff").show(), $("#fun_buy_lock_apy").html(fun_savings_apy[e] + "%"), t >= 500) {
            var a = parseInt(t + t * (fun_savings_apy[e] / 100) * (e / 365)),
                o = parseInt(a - t);
            $("#fun_lock_maturity_amount").html(a + ' <span style="color: green;">(+' + o + ")</span>")
        } else $("#fun_lock_maturity_amount").html(0);
    else $(".fun_lock_stuff").hide()
}

function RecalculateFUNSavingsMaturity() {
    var e = $("#fun_savings_time_dropdown").val(),
        t = parseInt($("#savings_fun_to_lock").val());
    if (15 == e || 30 == e || 90 == e || 180 == e || 360 == e)
        if (t >= 500) {
            var a = parseInt(t + t * (fun_savings_apy[e] / 100) * (e / 365)),
                o = parseInt(a - t);
            $("#fun_savings_maturity_amount").html(a + ' <span style="color: green;">(+' + o + ")</span>")
        } else $("#fun_savings_maturity_amount").html(0);
    else $("#fun_savings_maturity_amount").html(0)
}

function getParameterByName(e, t) {
    t || (t = window.location.href), e = e.replace(/[\[\]]/g, "\\$&");
    var a = new RegExp("[?&]" + e + "(=([^&#]*)|&|#|$)").exec(t);
    if (a) return a[2] ? decodeURIComponent(a[2].replace(/\+/g, " ")) : ""
}
token_tiers = [2500, 5e3, 12500, 5e4, 125e3, 25e4, 5e5], fun_savings_apy = {
    15: 5,
    30: 10,
    90: 15,
    180: 20,
    360: 25
}, fun_benefit_tiers = {
    0: {
        1: {
            wof: "0",
            cb: "0",
            int: "0"
        },
        3: {
            wof: "0",
            cb: "0",
            int: "0"
        },
        6: {
            wof: "0",
            cb: "0",
            int: "0"
        },
        12: {
            wof: "0",
            cb: "0",
            int: "0"
        }
    },
    2500: {
        1: {
            wof: "1",
            cb: "0.005",
            int: "0"
        },
        3: {
            wof: "2",
            cb: "0.0075",
            int: "0"
        },
        6: {
            wof: "3",
            cb: "0.01",
            int: "0"
        },
        12: {
            wof: "4",
            cb: "0.02",
            int: "0"
        }
    },
    5e3: {
        1: {
            wof: "3",
            cb: "0.01",
            int: "0"
        },
        3: {
            wof: "4",
            cb: "0.02",
            int: "0"
        },
        6: {
            wof: "5",
            cb: "0.03",
            int: "0"
        },
        12: {
            wof: "6",
            cb: "0.04",
            int: "0"
        }
    },
    12500: {
        1: {
            wof: "5",
            cb: "0.025",
            int: "2.5"
        },
        3: {
            wof: "6",
            cb: "0.05",
            int: "5"
        },
        6: {
            wof: "7",
            cb: "0.075",
            int: "7.5"
        },
        12: {
            wof: "8",
            cb: "0.1",
            int: "10"
        }
    },
    5e4: {
        1: {
            wof: "7",
            cb: "0.1",
            int: "2.5"
        },
        3: {
            wof: "8",
            cb: "0.2",
            int: "5"
        },
        6: {
            wof: "9",
            cb: "0.3",
            int: "7.5"
        },
        12: {
            wof: "10",
            cb: "0.4",
            int: "10"
        }
    },
    125e3: {
        1: {
            wof: "9",
            cb: "0.3",
            int: "7.5"
        },
        3: {
            wof: "10",
            cb: "0.4",
            int: "10"
        },
        6: {
            wof: "11",
            cb: "0.5",
            int: "12.5"
        },
        12: {
            wof: "12",
            cb: "0.6",
            int: "15"
        }
    },
    25e4: {
        1: {
            wof: "11",
            cb: "0.5",
            int: "12.5"
        },
        3: {
            wof: "12",
            cb: "0.6",
            int: "15"
        },
        6: {
            wof: "13",
            cb: "0.7",
            int: "17.5"
        },
        12: {
            wof: "14",
            cb: "0.8",
            int: "20"
        }
    },
    5e5: {
        1: {
            wof: "13",
            cb: "0.7",
            int: "17.5"
        },
        3: {
            wof: "14",
            cb: "0.8",
            int: "20"
        },
        6: {
            wof: "15",
            cb: "0.9",
            int: "22.5"
        },
        12: {
            wof: "16",
            cb: "1",
            int: "25"
        }
    }
}, fun_benefit_tiers_new = {
    0: {
        1: {
            wof: "0",
            cb: "0",
            int: "0"
        },
        30: {
            wof: "0",
            cb: "0",
            int: "0"
        },
        90: {
            wof: "0",
            cb: "0",
            int: "0"
        },
        180: {
            wof: "0",
            cb: "0",
            int: "0"
        },
        360: {
            wof: "0",
            cb: "0",
            int: "0"
        }
    },
    2500: {
        1: {
            wof: "1",
            cb: "0",
            int: "0"
        },
        30: {
            wof: "1",
            cb: "0.005",
            int: "0"
        },
        90: {
            wof: "2",
            cb: "0.0075",
            int: "0"
        },
        180: {
            wof: "3",
            cb: "0.01",
            int: "0"
        },
        360: {
            wof: "4",
            cb: "0.02",
            int: "0"
        }
    },
    5e3: {
        1: {
            wof: "3",
            cb: "0",
            int: "0"
        },
        30: {
            wof: "3",
            cb: "0.01",
            int: "0"
        },
        90: {
            wof: "4",
            cb: "0.02",
            int: "0"
        },
        180: {
            wof: "5",
            cb: "0.03",
            int: "0"
        },
        360: {
            wof: "6",
            cb: "0.04",
            int: "0"
        }
    },
    12500: {
        1: {
            wof: "5",
            cb: "0",
            int: "0"
        },
        30: {
            wof: "5",
            cb: "0.025",
            int: "2.5"
        },
        90: {
            wof: "6",
            cb: "0.05",
            int: "5"
        },
        180: {
            wof: "7",
            cb: "0.075",
            int: "7.5"
        },
        360: {
            wof: "8",
            cb: "0.1",
            int: "10"
        }
    },
    5e4: {
        1: {
            wof: "7",
            cb: "0",
            int: "0"
        },
        30: {
            wof: "7",
            cb: "0.1",
            int: "2.5"
        },
        90: {
            wof: "8",
            cb: "0.2",
            int: "5"
        },
        180: {
            wof: "9",
            cb: "0.3",
            int: "7.5"
        },
        360: {
            wof: "10",
            cb: "0.4",
            int: "10"
        }
    },
    125e3: {
        1: {
            wof: "9",
            cb: "0",
            int: "0"
        },
        30: {
            wof: "9",
            cb: "0.3",
            int: "7.5"
        },
        90: {
            wof: "10",
            cb: "0.4",
            int: "10"
        },
        180: {
            wof: "11",
            cb: "0.5",
            int: "12.5"
        },
        360: {
            wof: "12",
            cb: "0.6",
            int: "15"
        }
    },
    25e4: {
        1: {
            wof: "11",
            cb: "0",
            int: "0"
        },
        30: {
            wof: "11",
            cb: "0.5",
            int: "12.5"
        },
        90: {
            wof: "12",
            cb: "0.6",
            int: "15"
        },
        180: {
            wof: "13",
            cb: "0.7",
            int: "17.5"
        },
        360: {
            wof: "14",
            cb: "0.8",
            int: "20"
        }
    },
    5e5: {
        1: {
            wof: "13",
            cb: "0",
            int: "0"
        },
        30: {
            wof: "13",
            cb: "0.7",
            int: "17.5"
        },
        90: {
            wof: "14",
            cb: "0.8",
            int: "20"
        },
        180: {
            wof: "15",
            cb: "0.9",
            int: "22.5"
        },
        360: {
            wof: "16",
            cb: "1",
            int: "25"
        }
    }
}, $.ajaxSetup({
    data: {
        csrf_token: $.cookie("csrf_token")
    },
    beforeSend: function(e) {
        e.setRequestHeader("x-csrf-token", $.cookie("csrf_token"))
    },
    timeout: 12e4
}), $.extend({
    redirectPost: function(e, t) {
        var a = "";
        $.each(t, (function(e, t) {
            a += '<input type="hidden" name="' + e + '" value="' + t + '">'
        })), $('<form action="' + e + '" method="POST">' + a + "</form>").appendTo("body").submit()
    }
}), $(document).ready((function() {
    var e, t, a, o;
    e = window, t = document, e.pushpad = e.pushpad || function() {
        (e.pushpad.q = e.pushpad.q || []).push(arguments)
    }, a = t.getElementsByTagName("head")[0], (o = t.createElement("script")).async = 1, o.src = "https://pushpad.xyz/pushpad.js", a.appendChild(o), pushpad("init", 6483, {
        hostname: "freebitco.in"
    }), 0 != pushpad_hash && pushpad("uid", userid, pushpad_hash);
    var n = (new Date).getTimezoneOffset();
    fingerprint = $.fingerprint();
    var i = getParameterByName("r");
    if (void 0 !== i) null != i.match(/^[0-9]+$/) && ($.cookie.raw = !0, $.cookie("referrer", i, {
        expires: 3650,
        secure: !0,
        path: "/"
    }), $("#referrer_in_form").val(i), $("#referrer_in_form").attr("readonly", !0), $("#referrer_in_form").css("background-color", "#D9D9D9"));
    else {
        $.cookie.raw = !0;
        var s = $.cookie("referrer");
        s > 0 && ($("#referrer_in_form").val(s), $("#referrer_in_form").attr("readonly", !0), $("#referrer_in_form").css("background-color", "#D9D9D9"))
    }
    var r = getParameterByName("tag");
    if ($(".homepage_play_now_button").click((function(e) {
            window.location.replace("https://freebitco.in/static/html/one_click_signup_new.html?r=" + i + "&tag=" + r)
        })), $(window).load((function() {
            $(".push_modal_image").attr("src", "https://static1.freebitco.in/images/100.png")
        })), Date.now || (Date.now = function() {
            return (new Date).getTime()
        }), $("#login_form").hide(), $("body").on("click", ".login_menu_button", (function() {
            $("#signup_form").hide(), $("#homepage_login_button").hide(), $("#homepage_signup_button").show(), $("#login_form").fadeIn()
        })), userid > 0) {
        InitialUserStats(), $.get("/cgi-bin/api.pl?op=record_fingerprint&fingerprint=" + fingerprint);
        var l = setInterval((function() {
            1 == user_stats_loaded && (UpdateStats(), UpdateUserStats(), 0 == new_user_first_load && ($.cookie.raw = !0, 1 != $.cookie("hide_push_msg") && pushpad("status", (function(e) {
                e || $(".show_push_notifications_modal").click()
            }))), ("Flash-promo-aw" == getParameterByName("utm_source") || 1 == getParameterByName("flash_promo_modal")) && $("#multiply_page_flash_offer_modal_link").click(), clearInterval(l))
        }), 100);
        pushpad("tags", ["registered", n]), $(window).load((function() {
            post_loaded < 1 && ($("#logout_image").attr("src", "https://static1.freebitco.in/images/logout.png"), $("#myModal22").css("background-image", "url(https://sirv.freebitco.in/1572662671_zVgWVpUa.jpg)"), $.ionSound({
                sounds: ["jump_up", "bell_ring", "tap"],
                path: "https://fbtc-audio.freebitco.in/",
                multiPlay: !0
            }), post_loaded = 1)
        })), $(document).on("click", (function(e) {
            var t = e.target.id;
            t.replace(/\s+/g, ""), (null == typeof t || null == t || t.length < 3) && (t = $(e.target).text())
        })), UpdateFunPrice(), $(".binance_trading_contest_show").hide(), "ftd_offer" == getParameterByName("modal") ? $("#ftd_modal").foundation("reveal", "open") : "deposit_btc" == getParameterByName("modal") && $("#myModal16").foundation("reveal", "open"), Math.floor((new Date).getTime() / 1e3), $.get("/cgi-bin/api.pl?op=new_login_cookies", (function(e) {
            "success" == e.status && ($.cookie.raw = !0, $.cookie("fbtc_userid", e.userid, {
                expires: 3650,
                secure: !0,
                path: "/"
            }), $.cookie("userid", e.userid, {
                expires: 3650,
                secure: !0,
                path: "/"
            }), $.cookie("fbtc_session", e.session_cookie, {
                expires: 3650,
                secure: !0,
                path: "/"
            }), $.cookie("have_account", 1, {
                expires: 3650,
                secure: !0,
                path: "/"
            }))
        }))
    } else {
        var _ = getParameterByName("utm_medium");
        void 0 !== _ && ("email" != _ && "wof_lp" != _ && "token_lp" != _ && "please_login" != _ || ($(".login_menu_button").click(), DisplaySEMessage("e", "Please login to your account"))), UpdateStats(), pushpad("tags", ["unregistered", n]), $("#fbtc_userbase_img").attr("src", "https://sirv.freebitco.in/1574253847_If3WnVV8.png"), $("#fbtc_games_played_img").attr("src", "https://sirv.freebitco.in/1574253982_ImYCkaiy.png"), $("#fbtc_btc_won_img").attr("src", "https://sirv.freebitco.in/1574253604_qV3999Sg.png"), $("body").css("background-image", "url(https://sirv.freebitco.in/1574230692_Lsa9Jyc9.jpg)"), $(window).scroll((function() {
            post_loaded < 1 && ($("#home_free_btc_img").attr("src", "https://sirv.freebitco.in/1574167743_eh5ja4W1.png"), $("#home_btc_dice_img").attr("src", "https://sirv.freebitco.in/1574253404_gZhJZ2XC.png"), $("#home_ref_contest_img").attr("src", "https://sirv.freebitco.in/1574167858_VQHw8AK4.png"), $("#home_wager_contest_img").attr("src", "https://sirv.freebitco.in/1574167905_PE2uccRv.png"), $("#home_interest_img").attr("src", "https://sirv.freebitco.in/1574167765_KenJoFmp.png"), $("#home_pari_img").attr("src", "https://sirv.freebitco.in/1574167796_t3VSITIS.png"), $("#home_lottery_img").attr("src", "https://sirv.freebitco.in/1574167929_Yq2Me6O6.png"), $("#home_aff_program_img").attr("src", "https://sirv.freebitco.in/1574167828_NR2bVK8T.png"), $("#home_win_lambo_img").attr("src", "https://sirv.freebitco.in/1574253131_6hnDF9tJ.png"), $("body").innerWidth() < 626 ? $(".lambo_bg_div").css("background-image", "url(https://sirv.freebitco.in/1605529292_x0uNMlfM.png)") : $(".lambo_bg_div").css("background-image", "url(https://sirv.freebitco.in/1605529011_NxyJ2SbZ.jpg)"), post_loaded = 1)
        }))
    }
    balanceChanged(), RenewCookies(), $("#wager_contest_round_display").html(wagering_contest_winners_round_display), $("#lottery_round_display").html(lottery_winners_round_display), $("#hide_site_message").click((function() {
        $("#common_site_message").hide(), $.get("/?op=hide_site_message")
    })), $("#hide_payout_message").click((function() {
        $("#common_payout_message").hide(), $.get("/?op=hide_payout_message")
    })), charSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var c = "", d = 0; d < 16; d++) {
        var u = Math.floor(Math.random() * charSet.length);
        c += charSet.substring(u, u + 1)
    }
    $("#next_client_seed").val(c), $(".tabs a").click((function() {
        "mining_link" != $(this).attr("id") && ($(".tabs li").removeClass("active"), $(this).parent().addClass("active"))
    })), $("#free_play_link_li").addClass("active"), $("#faq_tab").on("load", (function() {
        $(".faq_answer").hide()
    })), $("#faq_tab").on("click", ".faq_question", (function() {
        $(this).next(".faq_answer").show()
    })), $("#what_is_bitcoin_signup_page_read_more_link").click((function() {
        $("#what_is_bitcoin_signup_page_read_more_link").hide(), $("#what_is_bitcoin_signup_page_more").show(), insertBitcoinMore("what_is_bitcoin_signup_page_more", "afterBegin"), $("#home_page_yt_video").html('<div class="large-12 small-12 large-centered small-centered columns" style="text-align:center; position: relative;padding-bottom: 56.25%; padding-top: 25px;height: 0;"><iframe id="ytplayer" type="text/html" src="//www.youtube.com/embed/Gc2en3nHxA4?fs=1&amp;hl=en_US&amp;rel=0&amp;hd=1" style="position: absolute;top: 0;left: 0;width:100%;height:100%;" frameborder="0" allowfullscreen></iframe></div>')
    })), $("#provably_fair_link").click((function() {
        $("html, body").animate({
            scrollTop: $("#provably_fair").offset().top - 45
        }, "fast")
    })), $("#auto_withdraw").change((function() {
        var e = $(this),
            t = 0;
        e.is(":checked") ? (t = 1, $("#earn_btc_aw_msg").show(), $("#earn_btc_msg").show(), $("#hide_earn_btc_msg").hide()) : ($("#hide_earn_btc_msg").show(), $("#earn_btc_aw_msg").hide()), $.get("/?op=toggle_auto_withdraw&val=" + t, (function(e) {
            var a = e.split(":");
            DisplaySEMessage(a[0], a[1]), "e" == a[0] && 1 == t && ($("#earn_btc_aw_msg").hide(), $("#hide_earn_btc_msg").show(), $("#auto_withdraw").attr("checked", !1))
        }))
    })), $("#earn_btc_disable_aw").click((function() {
        $.get("/?op=toggle_auto_withdraw&val=0", (function(e) {
            $("#earn_btc_aw_msg").hide(), DisplaySEMessage("s", "Auto-withdraw disabled"), $("#auto_withdraw").attr("checked", !1), $("#hide_earn_btc_msg").show()
        }))
    })), $("#signup_form").submit((function(e) {
        e.preventDefault(), $("#signup_button").prop("disabled", !0);
        var t = $(this),
            a = $.url().param("tag"),
            o = t.find('input[name="op"]').val(),
            n = t.find('input[name="referrer"]').val(),
            i = t.find('input[name="password"]').val(),
            s = t.find('input[name="email"]').val(),
            r = t.attr("action"),
            l = {
                op: o,
                password: i,
                email: s,
                fingerprint: fingerprint,
                referrer: n,
                tag: a
            };
        $("#signup_recaptcha") && $("#signup_recaptcha").length > 0 && "undefined" != typeof hcaptcha && (l.h_recaptcha_response = encodeURIComponent(hcaptcha.getResponse())), $("#captchasnet_signup_captcha .captchasnet_captcha_input_box").val() && $("#captchasnet_signup_captcha .captchasnet_captcha_input_box").val().length > 0 && (l.captchasnet_random = $("#captchasnet_signup_captcha .captchasnet_captcha_random").val(), l.captchasnet_response = $("#captchasnet_signup_captcha .captchasnet_captcha_input_box").val()), $("#captchasnet_signup_captcha2 .captchasnet_captcha_input_box").val() && $("#captchasnet_signup_captcha2 .captchasnet_captcha_input_box").val().length > 0 && (l.captchasnet_random2 = $("#captchasnet_signup_captcha2 .captchasnet_captcha_random").val(), l.captchasnet_response2 = $("#captchasnet_signup_captcha2 .captchasnet_captcha_input_box").val()), $("#securimage_signup_captcha .captchasnet_captcha_input_box").val() && $("#securimage_signup_captcha .captchasnet_captcha_input_box").val().length > 0 && (l.securimage_random = $("#securimage_signup_captcha .captchasnet_captcha_random").val(), l.securimage_response = $("#securimage_signup_captcha .captchasnet_captcha_input_box").val()), $("#botdetect_signup_captcha .captchasnet_captcha_input_box").val() && $("#botdetect_signup_captcha .captchasnet_captcha_input_box").val().length > 0 && (l.botdetect_random = $("#botdetect_signup_captcha .captchasnet_captcha_random").val(), l.botdetect_response = $("#botdetect_signup_captcha .captchasnet_captcha_input_box").val()), $.post(r, l).done((function(e) {
            var t = e.split(":");
            "e" == t[0] ? ("email_exists" == t[2] ? ($(".login_menu_button").click(), $("#login_form_btc_address").val(s), $("#login_form_password").val(i), $("#login_button").click()) : DisplaySEMessage(t[0], t[1]), $("#signup_recaptcha") && $("#signup_recaptcha").length > 0 && "undefined" != typeof hcaptcha && hcaptcha.reset(), $("#captchasnet_signup_captcha") && $("#captchasnet_signup_captcha").length > 0 && GenerateCaptchasNetCaptcha("captchasnet_signup_captcha", 0), $("#captchasnet_signup_captcha2") && $("#captchasnet_signup_captcha2").length > 0 && GenerateCaptchasNetCaptcha("captchasnet_signup_captcha2", 0), $("#securimage_signup_captcha") && $("#securimage_signup_captcha").length > 0 && GenerateCaptchasNetCaptcha("securimage_signup_captcha", 2), $("#botdetect_signup_captcha") && $("#botdetect_signup_captcha").length > 0 && GenerateCaptchasNetCaptcha("botdetect_signup_captcha", 3)) : "s" == t[0] && (console.log("gtm_trigger"), window.dataLayer = window.dataLayer || [], dataLayer.push({
                event: "signup"
            }), $.cookie.raw = !0, $.cookie("btc_address", t[1], {
                expires: 3650,
                secure: !0,
                path: "/"
            }), $.cookie("password", t[2], {
                expires: 3650,
                secure: !0,
                path: "/"
            }), $.cookie("fbtc_userid", t[3], {
                expires: 3650,
                secure: !0,
                path: "/"
            }), $.cookie("fbtc_session", t[4], {
                expires: 3650,
                secure: !0,
                path: "/"
            }), $.cookie("have_account", 1, {
                expires: 3650,
                secure: !0,
                path: "/"
            }), window.location.replace("https://freebitco.in/?op=home")), $("#signup_button").prop("disabled", !1)
        }))
    })), $(".captchasnet_captcha_info").hover((function() {
        $(this).find(".captchasnet_captcha_info_span, .arrow-up, .arrow-up-small").show()
    }), (function() {
        $(this).find(".captchasnet_captcha_info_span, .arrow-up, .arrow-up-small").hide()
    })), $("#login_button").click((function(e) {
        $("#login_button").prop("disabled", !0), $.post("/", {
            op: "login_new",
            btc_address: $("#login_form_btc_address").val(),
            password: $("#login_form_password").val(),
            tfa_code: $("#login_form_2fa").val()
        }).done((function(e) {
            var t = e.split(":");
            if ("e" == t[0]) DisplaySEMessage(t[0], t[1]);
            else if ("s" == t[0]) {
                $.cookie.raw = !0, $.cookie("btc_address", t[1], {
                    expires: 3650,
                    secure: !0,
                    path: "/"
                }), $.cookie("password", t[2], {
                    expires: 3650,
                    secure: !0,
                    path: "/"
                }), $.cookie("fbtc_userid", t[3], {
                    expires: 3650,
                    secure: !0,
                    path: "/"
                }), $.cookie("fbtc_session", t[4], {
                    expires: 3650,
                    secure: !0,
                    path: "/"
                }), $.cookie("have_account", 1, {
                    expires: 3650,
                    secure: !0,
                    path: "/"
                });
                var a = getParameterByName("ra");
                void 0 !== a && a.indexOf("http") > -1 ? window.location.replace(a) : window.location.replace("https://freebitco.in/?op=home")
            }
            $("#login_button").prop("disabled", !1)
        }))
    })), $("#reset_2fa_form_submit").click((function(e) {
        $("#reset_2fa_form_submit").prop("disabled", !0), $.post("/", {
            op: "login_new",
            type: "reset_2fa",
            subtype: $("#reset_2fa_subtype").val(),
            btc_address: $("#forgot_2fa_email").val(),
            password: $("#forgot_2fa_password").val(),
            forgot_2fa_extra_input: $("#forgot_2fa_extra_input").val()
        }).done((function(e) {
            var t = e.split(":");
            DisplaySEMessage(t[0], t[1]), $("#reset_2fa_form_submit").prop("disabled", !1), "mobile_ver" == $("#reset_2fa_subtype").val() && $("#forgot_2fa_secret_key_container_div").is(":hidden") && "s" == t[0] && ($("#forgot_2fa_secret_key_container_div").show(), $("#forgot_2fa_extra_input").val(""), $("#forgot_2fa_extra_field").html("VERIFICATION CODE"))
        }))
    })), $("#enable_2fa_msg").click((function() {
        SwitchPageTabs("edit"), $("html, body").animate({
            scrollTop: $("#2fa_profile_box").offset().top - 45
        }, "fast"), $("#2fa_profile_box").click()
    })), $("#advertise_imp_note").click((function(e) {
        alert("Please note that the balance in your advertising account is non-refundable and cannot be transferred to your main account balance on the website so only send/transfer in what you intend to use.")
    })), $(".free_play_link").click((function(e) {
        SwitchPageTabs("free_play")
    })), $(".double_your_btc_link").click((function(e) {
        SwitchPageTabs("double_your_btc")
    })), $(".slots_link").click((function(e) {
        SwitchPageTabs("slots")
    })), $(".betting_link").click((function(e) {
        SwitchPageTabs("betting")
    })), $(".wager_promotion_link").click((function(e) {
        SwitchPageTabs("wager_promotion")
    })), $(".lottery_link").click((function(e) {
        SwitchPageTabs("lottery"), $(".tabs li").removeClass("active"), $(".tabs li").find(".lottery_link").parent().addClass("active")
    })), $(".faq_link").click((function(e) {
        SwitchPageTabs("faq"), document.getElementById("faq_tab").insertAdjacentHTML("afterBegin", '<h3>WEBSITE FAQ</h3><p class="faq_question bold">When will I get paid if I have Auto Withdraw enabled?</p><div class="faq_answer"><p>If you have Auto-Withdraw enabled in your account, your account balance will go into PENDING on Sunday (if it is more than the min. withdraw amount) and you will be able to see this under PENDING PAYOUT on the FREE BTC page. The Bitcoins will be sent to your Bitcoin wallet soon after. You will receive an email notifying you of the payment if you have an email address associated with your account. If you wish to know the exact time when your balance will go into pending, click on the button that says <b>WITHDRAW</b> in the <b>FREE BTC</b> page and then click on <b>AUTO</b> and you will see a timer counting down to the payout time.</p></div><p class="faq_question bold">How do I enable Auto Withdraw?</p><div class="faq_answer"><p>By clicking on the button that says <b>WITHDRAW</b> in the <b>FREE BTC</b> page, then clicking on <b>AUTO</b> and checking the box next to <b>AUTO WITHDRAW</b>. If you enable auto-withdraw after the countdown timer has run out for the current payout cycle, you will receive your payment the next week.</p></div><p class="faq_question bold">When will I get paid if I have requested a Manual Withdraw?</p><div class="faq_answer"><p>If you request a manual withdrawal, the Bitcoins will be sent to your wallet within 6 hours of you initiating the request.</p></div><p class="faq_question bold">When will I get paid if I have requested an Instant Withdraw?</p><div class="faq_answer"><p>If you request an instant withdrawal, the Bitcoins will be sent to your wallet within 15 minutes of you initiating the request.</p></div><p class="faq_question bold">How can I change my Bitcoin address or Email address?</p><div class="faq_answer"><p>By clicking on the button that says <b>PROFILE</b> in the top menu. You will be able to change your email address only if the email that is currently attached to your account is invalid or it is bouncing our emails back.</p></div><p class="faq_question bold">Where can I see my referral link or my referrals?</p><div class="faq_answer"><p>By clicking on the button that says <b>REFER</b> in the top menu.</p></div><p class="faq_question bold">How do I refer my friends?</p><div class="faq_answer"><p>Share your referral link with your friends and ask them to visit it and create an account. On doing so, they will be automatically added as your referral and you will get 50% of their free btc winnings as commission! Nothing will be deducted from their account, we pay the 50% out of our pocket. You will also receive 1 free ticket to our weekly lottery every time your friend plays a free roll! If you do not know how to get your referral link, please see the question above.</p></div><p class="faq_question bold">I have lost/wish to reset my password?</p><div class="faq_answer"><p>Please go to the login page and click on the link that says <b>Forgot Password</b> in the login box.</p></div><p class="faq_question bold">Why does the amount of Bitcoins that you can win, keep changing?</p><div class="faq_answer"><p>The amount of bitcoins that you can win with <b>FREE BTC</b> depends on the current bitcoin price and the biggest prize is fixed at US$200 and the other prizes in proportion to it. So, when the price of a bitcoin goes down, the reward amount calculated in bitcoins goes up and the other way round is also true. So, regardless of the current bitcoin price, you have a fair chance of winning US$200 in bitcoins on each roll.</p></div><p class="faq_question bold">Can you reverse a payment that has already been sent?</p><div class="faq_answer"><p>Unfortunately bitcoin payments are irreversible and so once a payment has been sent, we have no way of getting it back. You should ensure that the correct withdrawal address is specified in the <b>PROFILE</b> page before requesting a payment or enabling auto-withdraw.</p></div><p class="faq_question bold">Where can I check my activity on this website?</p><div class="faq_answer"><p>By clicking on <b>STATS</b> in the above menu and then on <b>PERSONAL STATS</b>.</p></div><p class="faq_question bold">How can I keep my account secure?</p><div class="faq_answer"><p>By using a strong password, not re-using the same password on any other website and not sharing your password with anybody else. We recommend using a password manager like <a href="https://lastpass.com/" target=_blank>LastPass</a> to create and store your passwords. If you do not use these security practices and your account gets hacked, we shall not be able to help you.</p></div><p class="faq_question bold">How can I contact you?</p><div class="faq_answer"><p>By filling in the form below. Please read the questions above before sending us an email. We receive hundreds of emails everyday and do not have the resources to reply to all of them, so we have a policy of not responding to emails asking questions that have already been answered on this page.</p>'), insertBitcoinMore("faq_tab", "beforeEnd")
    })), $(".refer_link").click((function(e) {
        SwitchPageTabs("refer")
    })), $(".rewards_link").click((function(e) {
        $(".tabs li").removeClass("active"), $(".tabs li").find(".rewards_link").parent().addClass("active"), SwitchPageTabs("rewards")
    })), $(".earn_btc_link").click((function(e) {
        $(".tabs li").removeClass("active"), $(".tabs li").find(".earn_btc_link").parent().addClass("active"), SwitchPageTabs("earn_btc")
    })), $(".edit_link").click((function(e) {
        SwitchPageTabs("edit")
    })), $(".news_link").click((function(e) {
        SwitchPageTabs("news")
    })), $(".stats_link").click((function(e) {
        SwitchPageTabs("stats")
    })), $(".golden_ticket_link").click((function(e) {
        SwitchPageTabs("golden_ticket")
    })), $(".loyalty_token_link").click((function(e) {
        SwitchPageTabs("loyalty_token")
    })), $("#site_stats_button").click((function() {
        $("#personal_stats_button").show(), $("#site_stats_button").hide(), $("#site_stats").show(), $("#personal_stats").hide()
    })), $("#personal_stats_button").click((function() {
        $("#personal_stats_button").hide(), $("#site_stats_button").show(), $("#site_stats").hide(), $("#personal_stats").show()
    })), $("#double_your_btc_2x").click((function(e) {
        var t = $("#double_your_btc_stake").val(),
            a = parseFloat($("#bonus_account_balance").html()),
            o = parseFloat($("#balance").html()),
            n = parseFloat(Math.round(1e8 * (a + o)) / 1e8).toFixed(8);
        2 * t <= n ? 2 * t * ($("#double_your_btc_payout_multiplier").val() - 1) <= max_win_amount ? $("#double_your_btc_stake").val(parseFloat(Math.round(2 * t * 1e8) / 1e8).toFixed(8)) : $("#double_your_btc_stake").val(parseFloat(Math.round(max_win_amount / ($("#double_your_btc_payout_multiplier").val() - 1) * 1e8) / 1e8).toFixed(8)) : 2 * t * ($("#double_your_btc_payout_multiplier").val() - 1) <= max_win_amount ? $("#double_your_btc_stake").val(n) : $("#double_your_btc_stake").val(parseFloat(Math.round(max_win_amount / ($("#double_your_btc_payout_multiplier").val() - 1) * 1e8) / 1e8).toFixed(8)), CalculateWinAmount()
    })), $("#double_your_btc_half").click((function(e) {
        var t = $("#double_your_btc_stake").val(),
            a = parseFloat($("#bonus_account_balance").html()),
            o = parseFloat($("#balance").html()),
            n = parseFloat(Math.round(1e8 * (a + o)) / 1e8).toFixed(8);
        .5 * t <= n ? .5 * t * ($("#double_your_btc_payout_multiplier").val() - 1) <= max_win_amount ? $("#double_your_btc_stake").val(parseFloat(Math.round(.5 * t * 1e8) / 1e8).toFixed(8)) : $("#double_your_btc_stake").val(parseFloat(Math.round(max_win_amount / ($("#double_your_btc_payout_multiplier").val() - 1) * 1e8) / 1e8).toFixed(8)) : .5 * t * ($("#double_your_btc_payout_multiplier").val() - 1) <= max_win_amount ? $("#double_your_btc_stake").val(n) : $("#double_your_btc_stake").val(parseFloat(Math.round(max_win_amount / ($("#double_your_btc_payout_multiplier").val() - 1) * 1e8) / 1e8).toFixed(8)), CalculateWinAmount()
    })), $("#double_your_btc_max").click((function(e) {
        if (1 == confirm("Are you sure you wish to bet the maximum amount? Click OK if you would like to proceed else click CANCEL.")) {
            $("#double_your_btc_stake").val();
            var t = parseFloat($("#bonus_account_balance").html()),
                a = parseFloat($("#balance").html()),
                o = parseFloat(Math.round(1e8 * (t + a)) / 1e8).toFixed(8);
            o * ($("#double_your_btc_payout_multiplier").val() - 1) <= max_win_amount ? $("#double_your_btc_stake").val(o) : $("#double_your_btc_stake").val(parseFloat(Math.round(max_win_amount / ($("#double_your_btc_payout_multiplier").val() - 1) * 1e8) / 1e8).toFixed(8)), CalculateWinAmount()
        }
    })), $("#double_your_btc_min").click((function(e) {
        $("#double_your_btc_stake").val();
        var t = parseFloat($("#bonus_account_balance").html()),
            a = parseFloat($("#balance").html());
        parseFloat(Math.round(1e8 * (t + a)) / 1e8).toFixed(8) >= 1e-8 ? $("#double_your_btc_stake").val("0.00000001") : $("#double_your_btc_stake").val("0.00000000"), CalculateWinAmount()
    })), $("#double_your_btc_stake").keyup((function(e) {
        CalculateWinAmount()
    })), $("#double_your_btc_stake").keydown((function(e) {
        $("#double_your_btc_stake").keyup()
    })), $("#double_your_btc_stake").keypress((function(e) {
        $("#double_your_btc_stake").keyup()
    })), $("#double_your_btc_stake").focusout((function(e) {
        $("#double_your_btc_stake").keyup()
    })), $("#double_your_btc_bet_hi_button").click((function(e) {
        DoubleYourBTC("hi")
    })), $("#double_your_btc_bet_lo_button").click((function(e) {
        DoubleYourBTC("lo")
    })), $(".buy_fun_tokens_btn").click((function(e) {
        UpdateFunPrice(), $("#buy_fun_modal").foundation("reveal", "open")
    })), $("#contact_form").submit((function(e) {
        e.preventDefault(), $("#contact_form_button").attr("disabled", !0);
        var t = $(this),
            a = t.find('input[name="op"]').val(),
            o = t.find('input[name="name"]').val(),
            n = t.find('input[name="email"]').val(),
            i = t.find('textarea[name="message"]').val(),
            s = t.attr("action");
        $.post(s, {
            op: a,
            name: o,
            email: n,
            message: i
        }).done((function(e) {
            var t = e.split(":");
            $("#contact_form_error").html(""), $("#contact_form_error").hide(), $("#contact_form_success").html(""), $("#contact_form_success").hide(), $("#contact_form_name").removeClass("input-error"), $("#contact_form_email").removeClass("input-error"), $("#contact_form_message").removeClass("input-error"), "e1" == t[0] && ($("#contact_form_error").show(), $("#contact_form_error").html("Please enter your name"), $("#contact_form_name").addClass("input-error")), "e2" == t[0] && ($("#contact_form_error").show(), $("#contact_form_error").html("Invalid email address entered"), $("#contact_form_email").addClass("input-error")), "e3" == t[0] && ($("#contact_form_error").show(), $("#contact_form_error").html("Message must be atleast 10 characters"), $("#contact_form_message").addClass("input-error")), "s1" == t[0] && ($("#contact_form_success").show(), $("#contact_form_success").html("Message sent successfully!"), $("#contact_form_message").val("")), $("#contact_form_button").attr("disabled", !1)
        }))
    })), $("#forgot_password_button").click((function(e) {
        $("#forgot_password_button").prop("disabled", !0), $.post("/", {
            op: "forgot_password",
            email: $("#forgot_password_email").val(),
            captchasnet_random: $("#captchasnet_forgot_password_captcha .captchasnet_captcha_random").val(),
            captchasnet_response: $("#captchasnet_forgot_password_captcha .captchasnet_captcha_input_box").val(),
            fingerprint: fingerprint
        }).done((function(e) {
            var t = e.split(":");
            DisplaySEMessage(t[0], t[1]), $("#forgot_password_button").prop("disabled", !1), GenerateCaptchasNetCaptcha("captchasnet_forgot_password_captcha", 0)
        }))
    })), $("#password_reset_form").submit((function(e) {
        e.preventDefault(), $("#password_reset_form_button").attr("disabled", !0);
        var t = $("#password_reset_form_btc_address").val(),
            a = $("#password_reset_form_signature").val(),
            o = $("#password_reset_form_message").val();
        if (verify_message(a, o) == t) {
            var n = $(this),
                i = n.find('input[name="op"]').val(),
                s = n.find('input[name="btc_address"]').val(),
                r = n.find('input[name="message"]').val(),
                l = n.find('input[name="signature"]').val(),
                _ = n.attr("action");
            $.post(_, {
                op: i,
                btc_address: s,
                message: r,
                signature: l
            }).done((function(e) {
                $("#password_reset_message").hide(), $("#password_reset_message").html(""), $("#password_reset_message").removeClass("green"), $("#password_reset_message").removeClass("red"), "e1" == e && ($("#password_reset_message").show(), $("#password_reset_message").html("Invalid Bitcoin Address entered"), $("#password_reset_message").addClass("red")), "e2" == e && ($("#password_reset_message").show(), $("#password_reset_message").html("Invalid Email Address"), $("#password_reset_message").addClass("red")), "e3" == e && ($("#password_reset_message").show(), $("#password_reset_message").html("Signature cannot be blank"), $("#password_reset_message").addClass("red")), "e4" == e && ($("#password_reset_message").show(), $("#password_reset_message").html("No account associated with this Bitcoin Address exists in our database"), $("#password_reset_message").addClass("red")), "e5" == e && ($("#password_reset_message").show(), $("#password_reset_message").html("An account with this email address already exists. Please use the forgot password box above instead."), $("#password_reset_message").addClass("red")), "s1" == e && ($("#password_reset_message").show(), $("#password_reset_message").html("Password reset request queued. Please check your email inbox after 1 hour for the password reset link."), $("#password_reset_message").addClass("green"))
            }))
        } else $("#password_reset_message").show(), $("#password_reset_message").html("Incorrect signature. Please follow the instructions for signing messages above and then try again."), $("#password_reset_message").addClass("red");
        $("#password_reset_form_button").attr("disabled", !1)
    })), $("#change_password_button").click((function() {
        $.post("/", {
            op: "change_password",
            old_password: $("#cp_old_password").val(),
            new_password: $("#cp_new_password").val(),
            repeat_new_password: $("#cp_repeat_new_password").val(),
            tfa_code: $("#cp_tfa_code").val()
        }).done((function(e) {
            var t = e.split(":");
            DisplaySEMessage(t[0], t[1]), "s" == t[0] && ($.cookie.raw = !0, $.cookie("password", t[2], {
                expires: 3650,
                secure: !0,
                path: "/"
            }))
        }))
    })), $("#edit_profile_button").click((function() {
        $.post("/", {
            op: "edit_profile",
            func: "change_btc_address",
            new_btc_address: $("#edit_profile_form_btc_address").val(),
            password: $("#cba_password").val(),
            tfa_code: $("#cba_tfa_code").val()
        }).done((function(e) {
            var t = e.split(":");
            DisplaySEMessage(t[0], t[1]), "s1" == t[2] ? ($.cookie.raw = !0, $.cookie("btc_address", t[3], {
                expires: 3650,
                secure: !0,
                path: "/"
            }), $(".withdraw_btc_address").html(t[3]), $(".withdraw_btc_address").val(t[3]), profile_withdraw_address = t[3]) : "s2" == t[2] && $("#edit_profile_form_btc_address").val(t[3])
        }))
    })), $("#change_email_button").click((function() {
        $.post("/", {
            op: "edit_profile",
            func: "change_email",
            new_email: $("#edit_profile_form_email").val(),
            password: $("#ce_password").val(),
            tfa_code: $("#ce_tfa_code").val()
        }).done((function(e) {
            var t = e.split(":");
            DisplaySEMessage(t[0], t[1])
        }))
    })), $("#equal_share").click((function(e) {
        $("#weighted_share").attr("checked", !1), $("#last_payout_share").attr("checked", !1)
    })), $("#weighted_share").click((function(e) {
        $("#equal_share").attr("checked", !1), $("#last_payout_share").attr("checked", !1)
    })), $("#last_payout_share").click((function(e) {
        $("#equal_share").attr("checked", !1), $("#weighted_share").attr("checked", !1)
    })), $(".footer_cur_year").html((new Date).getFullYear()), $("#get_tag_stats").change((function() {
        var e = $("#get_tag_stats").val();
        $.get("/?op=show_advanced_tag_stats&tag=" + e, (function(e) {
            $("#detailed_tag_stats_table").show(), $("#detailed_tag_stats_table").find("tr:gt(0)").remove(), $("#detailed_tag_stats_table").append(e)
        }))
    })), $(".button").click((function() {
        $(this).blur()
    })), $("#as_equal_share").click((function(e) {
        $("#as_weighted_share").attr("checked", !1), $("#as_last_payout_share").attr("checked", !1)
    })), $("#as_weighted_share").click((function(e) {
        $("#as_equal_share").attr("checked", !1), $("#as_last_payout_share").attr("checked", !1)
    })), $("#as_last_payout_share").click((function(e) {
        $("#as_equal_share").attr("checked", !1), $("#as_weighted_share").attr("checked", !1)
    })), $("#as_button").click((function(e) {
        var t, a = $("#as_percent").val();
        $("#as_button").attr("disabled", !0), $("#as_equal_share").is(":checked") && (t = 1), $("#as_weighted_share").is(":checked") && (t = 2), $("#as_last_payout_share").is(":checked") && (t = 3), $.get("/?op=set_auto_share&mode=" + t + "&as_percent=" + a, (function(e) {
            var t = e.split(":");
            $("#as_error").hide(), $("#as_success").hide(), "e1" == t[0] && ($("#as_error").show(), $("#as_error").html("Invalid auto-share percentage")), "e2" == t[0] && ($("#as_error").show(), $("#as_error").html("Invalid auto-share mode")), "s1" == t[0] && ($("#as_success").show(), $("#as_success").html("Auto-share set successfully!")), $("#as_button").attr("disabled", !1)
        }))
    })), $(".withdraw_box_button").click((function() {
        $.get("/?op=get_current_address_and_balance", (function(e) {
            var t = e.split(":");
            "s" == t[0] && ($("#balance").html(t[2]), balanceChanged(), m_w_fee = t[3], i_w_fee = t[4], $(".withdraw_btc_address").html(t[1]), $("#edit_profile_form_btc_address").val(t[1]), profile_withdraw_address = t[1]);
            var a = $("#balance").html(),
                o = parseFloat(Math.floor(1e8 * (a - 1e-8)) / 1e8).toFixed(8);
            withdraw_max_amount = o, $("#withdrawal_amount").val(""), $("#instant_withdrawal_amount").val(""), $("#manual_min_withdraw").html(parseFloat(min_withdraw).toFixed(8)), $("#instant_min_withdraw").html(parseFloat(min_withdraw).toFixed(8)), $(".manual_withdraw_fee").html(m_w_fee), $(".instant_withdraw_fee").html(i_w_fee), $("#manual_withdraw_btc_add").val(""), $("#instant_withdraw_btc_add").val(""), $("#manual_withdraw_amt_recv").html("0.00000000"), $("#instant_withdraw_amt_recv").html("0.00000000")
        }))
    })), $(".withdraw_use_profile_address").click((function() {
        $("#manual_withdraw_btc_add").val(profile_withdraw_address), $("#instant_withdraw_btc_add").val(profile_withdraw_address)
    })), $(".withdraw_all_link").click((function() {
        $("#withdrawal_amount").val(parseFloat(withdraw_max_amount - parseFloat(m_w_fee)).toFixed(8)), $("#instant_withdrawal_amount").val(parseFloat(withdraw_max_amount - parseFloat(i_w_fee)).toFixed(8)), $("#withdrawal_amount").keyup(), $("#instant_withdrawal_amount").keyup()
    })), $("#withdrawal_amount").keyup((function() {
        var e = $("#withdrawal_amount").val();
        e.indexOf(",") > -1 && (e = e.replace(/,/g, "."), $("#withdrawal_amount").val(e)), $("#manual_withdraw_amt_recv").html(parseFloat(parseFloat($("#withdrawal_amount").val()) + parseFloat(m_w_fee)).toFixed(8))
    })), $("#withdrawal_amount").keypress((function() {
        $("#withdrawal_amount").keyup()
    })), $("#withdrawal_amount").keydown((function() {
        $("#withdrawal_amount").keyup()
    })), $("#instant_withdrawal_amount").keyup((function() {
        var e = $("#instant_withdrawal_amount").val();
        e.indexOf(",") > -1 && (e = e.replace(/,/g, "."), $("#instant_withdrawal_amount").val(e)), $("#instant_withdraw_amt_recv").html(parseFloat(parseFloat($("#instant_withdrawal_amount").val()) + parseFloat(i_w_fee)).toFixed(8))
    })), $("#instant_withdrawal_amount").keypress((function() {
        $("#instant_withdrawal_amount").keyup()
    })), $("#instant_withdrawal_amount").keydown((function() {
        $("#instant_withdrawal_amount").keyup()
    })), $("#fun_withdrawal_amount").keyup((function() {
        var e = $("#fun_withdrawal_amount").val();
        e.indexOf(",") > -1 && (e = e.replace(/,/g, "."), $("#fun_withdrawal_amount").val(e)), $("#fun_withdraw_amt_recv").html(parseInt(parseInt($("#fun_withdrawal_amount").val()) + parseFloat(f_w_fee)))
    })), $("#fun_withdrawal_amount").keypress((function() {
        $("#fun_withdrawal_amount").keyup()
    })), $("#fun_withdrawal_amount").keydown((function() {
        $("#fun_withdrawal_amount").keyup()
    })), $("#autobet_win_return_to_base").click((function(e) {
        $("#autobet_win_increase_bet").attr("checked", !1)
    })), $("#autobet_win_increase_bet").click((function(e) {
        $("#autobet_win_return_to_base").attr("checked", !1)
    })), $("#autobet_lose_return_to_base").click((function(e) {
        $("#autobet_lose_increase_bet").attr("checked", !1)
    })), $("#autobet_lose_increase_bet").click((function(e) {
        $("#autobet_lose_return_to_base").attr("checked", !1)
    })), $("#autobet_bet_hi").click((function(e) {
        $("#autobet_bet_lo").attr("checked", !1), $("#autobet_bet_alternate").attr("checked", !1)
    })), $("#autobet_bet_lo").click((function(e) {
        $("#autobet_bet_hi").attr("checked", !1), $("#autobet_bet_alternate").attr("checked", !1)
    })), $("#autobet_bet_alternate").click((function(e) {
        $("#autobet_bet_hi").attr("checked", !1), $("#autobet_bet_lo").attr("checked", !1)
    })), $("#autobet_max_bet_reset").click((function(e) {
        $("#autobet_max_bet_stop").attr("checked", !1)
    })), $("#autobet_max_bet_stop").click((function(e) {
        $("#autobet_max_bet_reset").attr("checked", !1)
    })), $("#flash_bet_on_events").click((function(e) {
        $("#flash_offer_modal").foundation("reveal", "close")
    })), $("#start_autobet").click((function(e) {
        $("#autobet_error").hide(), $("#autobet_error").html(""), $(".play_jackpot").prop("checked", !1), $(".autobet_play_jackpot:checkbox:checked").map((function() {
            $(".play_jackpot:checkbox[value=" + this.value + "]").prop("checked", !0)
        }));
        var t = $("#autobet_base_bet").val(),
            a = $("#autobet_bet_odds").val(),
            o = $("#autobet_max_bet").val(),
            n = $("#autobet_roll_count").val(),
            i = "alternate",
            s = 0,
            r = 0,
            l = 0,
            _ = 0,
            c = 0,
            d = 0,
            u = 0,
            p = 0,
            b = 0,
            m = 0,
            h = parseFloat(0).toFixed(8),
            f = 0,
            g = 0;
        $("#autobet_bet_hi").is(":checked") && (i = "hi"), $("#autobet_bet_lo").is(":checked") && (i = "lo"), t < 1e-8 || t > max_win_amount ? AutoBetErrors("e1") : a < 1.01 || a > 4750 ? AutoBetErrors("e2") : o < 1e-8 || o > max_win_amount ? AutoBetErrors("e3") : n < 1 ? AutoBetErrors("e4") : $("#autobet_win_change_odds").is(":checked") && ($("#autobet_win_change_odds_value").val() < 1.01 || $("#autobet_win_change_odds_value").val() > 4750) ? AutoBetErrors("e5") : $("#autobet_lose_change_odds").is(":checked") && ($("#autobet_lose_change_odds_value").val() < 1.01 || $("#autobet_lose_change_odds_value").val() > 4750) ? AutoBetErrors("e6") : $("#stop_after_profit").is(":checked") && $("#stop_after_profit_value").val() <= 0 ? AutoBetErrors("e7") : $("#stop_after_loss").is(":checked") && $("#stop_after_loss_value").val() <= 0 ? AutoBetErrors("e8") : (stop_autobet = !1, $("#auto_betting_button").hide(), $("#stop_auto_betting").show(), $("#double_your_btc_middle_section").css({
            height: "auto",
            "border-radius": "0 0 10px 10px",
            "padding-bottom": "20px"
        }), $("#double_your_btc_stake").val(t), $("#double_your_btc_payout_multiplier").val(a), $("#double_your_btc_payout_multiplier").keyup(), $("#rolls_played_count").html("0"), $("#rolls_played_count").html("0"), $("#rolls_status").show(), $("#autobet_highest_bet_msg").show(), $("#autobet_highest_bet").html("0.00000000 BTC"), $("#autobet_highest_win_msg").show(), $("#autobet_highest_win").html("0.00000000 BTC"), $("#autobet_pl_msg").show(), $("#autobet_pl").addClass("green"), $("#autobet_pl").css({
            "background-color": "#33FF33"
        }), $("#autobet_pl").html("0.00000000 BTC"), $("#autobet_win_return_to_base").is(":checked") && (s = 1), $("#autobet_lose_return_to_base").is(":checked") && (l = 1), $("#autobet_win_increase_bet").is(":checked") && (r = $("#autobet_win_increase_bet_percent").val()), $("#autobet_lose_increase_bet").is(":checked") && (_ = $("#autobet_lose_increase_bet_percent").val()), $("#autobet_win_change_odds").is(":checked") && (c = $("#autobet_win_change_odds_value").val()), $("#autobet_lose_change_odds").is(":checked") && (d = $("#autobet_lose_change_odds_value").val()), $("#autobet_change_client_seed").is(":checked") && (u = 1), $("#autobet_max_bet_reset").is(":checked") && (p = 1), $("#autobet_dnr").is(":checked") && (autobet_dnr = !0), $("#stop_after_profit").is(":checked") && (b = $("#stop_after_profit_value").val()), $("#stop_after_loss").is(":checked") && (m = $("#stop_after_loss_value").val()), $("#autobet_log_bets").is(":checked") && (f = 1, $("#autobet_view_bet_log").show()), $("#autobet_enable_worker").is(":checked"), $("#autobet_log_bets").is(":checked") && (f = 1, $(".autobet_view_bet_log").show()), $("#autobet_enable_sounds").is(":checked") && (g = 1), autobet_running = !0, autobet_history = [], AutoBet(i, n, o, t, s, l, r, _, u, p, 0, 0, 0, h, c, d, b, m, f, g))
    })), $("#stop_autobet_button").click((function(e) {
        stop_autobet = !0
    })), 1 == $.cookie("free_play_sound") && ($("#free_play_sound").prop("checked", !0), free_play_sound = !0), $("#test_sound").click((function(e) {
        $.ionSound.play("jump_up")
    })), $("#free_play_sound").click((function(e) {
        $.cookie.raw = !0, $("#free_play_sound").is(":checked") ? ($.cookie("free_play_sound", 1, {
            expires: 3650,
            secure: !0,
            path: "/"
        }), free_play_sound = !0) : ($.cookie("free_play_sound", 0, {
            expires: 3650,
            secure: !0,
            path: "/"
        }), free_play_sound = !1)
    })), $("#auto_withdraw_option_link").click((function(e) {
        $(".withdraw_options").hide(), $("#auto_withdraw_option").show()
    })), $("#manual_withdraw_option_link").click((function(e) {
        $(".withdraw_options").hide(), $("#manual_withdraw_option").show()
    })), $("#instant_withdraw_option_link").click((function(e) {
        $(".withdraw_options").hide(), $("#instant_withdraw_option").show()
    })), $("#bcc_withdraw_option_link").click((function(e) {
        $(".withdraw_options").hide(), $("#bcc_withdraw_option").show()
    })), $(".withdraw_options_ul a").click((function() {
        return $(".withdraw_options_ul a.active").removeClass(), $(this).addClass("active").blur(), !1
    })), $("#auto_withdraw_option_link").click(), $(".remove_autobet_error").focus((function() {
        $("#autobet_error").hide(), $("#autobet_error").html("")
    })), $("#instant_withdrawal_button").click((function(e) {
        $("#instant_withdrawal_button").attr("disabled", !0), $.post("/", {
            op: "withdraw",
            type: "instant",
            amount: $("#instant_withdrawal_amount").val(),
            withdraw_address: $("#instant_withdraw_btc_add").val(),
            tfa_code: $("#iw_tfa_code").val()
        }).done((function(e) {
            var t = e.split(":");
            "s" == t[0] && ($("#balance").html(t[2]), balanceChanged(), $("#manual_withdraw_btc_add").val(""), $("#instant_withdraw_btc_add").val(""), withdraw_max_amount = parseFloat(Math.floor(1e8 * (t[2] - 1e-8)) / 1e8).toFixed(8), $("#withdrawal_amount").val(""), $("#instant_withdrawal_amount").val(""), $("#manual_withdraw_amt_recv").html("0.00000000"), $("#instant_withdraw_amt_recv").html("0.00000000")), DisplaySEMessage(t[0], t[1]), $("#instant_withdrawal_button").attr("disabled", !1)
        }))
    })), $("#fun_withdrawal_button").click((function(e) {
        $("#fun_withdrawal_button").attr("disabled", !0), $.post("/", {
            op: "withdraw_fun",
            withdraw_qty: $("#fun_withdrawal_amount").val(),
            fun_address: $("#fun_withdraw_add").val(),
            tfa_code: $("#fw_tfa_code").val()
        }).done((function(e) {
            "success" == e.status ? (DisplaySEMessage("s", e.msg), UpdateFunPrice()) : "error" == e.status ? DisplaySEMessage("e", e.msg) : DisplaySEMessage("e", "Unexpected error. Please reload the page."), $("#fun_withdrawal_button").attr("disabled", !1)
        }))
    })), $("#withdrawal_button").click((function(e) {
        $("#withdrawal_button").attr("disabled", !0), $.post("/", {
            op: "withdraw",
            type: "slow",
            amount: $("#withdrawal_amount").val(),
            withdraw_address: $("#manual_withdraw_btc_add").val(),
            tfa_code: $("#mw_tfa_code").val()
        }).done((function(e) {
            var t = e.split(":");
            "s" == t[0] && ($("#balance").html(t[2]), balanceChanged(), $("#manual_withdraw_btc_add").val(""), $("#instant_withdraw_btc_add").val(""), withdraw_max_amount = parseFloat(Math.floor(1e8 * (t[2] - 1e-8)) / 1e8).toFixed(8), $("#withdrawal_amount").val(""), $("#instant_withdrawal_amount").val(""), $("#manual_withdraw_amt_recv").html("0.00000000"), $("#instant_withdraw_amt_recv").html("0.00000000")), DisplaySEMessage(t[0], t[1]), $("#withdrawal_button").attr("disabled", !1)
        }))
    })), $("#buy_fun_confirm").click((function(e) {
        $("#buy_fun_confirm").attr("disabled", !0), $.post("/cgi-bin/api.pl", {
            op: "trade_fun",
            fun_price: parseFloat($("#fun_buy_price").html()).toFixed(8),
            buy_qty: parseInt($("#buy_fun_count").val()),
            tag: "fbtc_website",
            type: "buy"
        }).done((function(e) {
            if ("success" == e.status) {
                $("#balance").html(parseFloat(e.balance / 1e8).toFixed(8)), balanceChanged(), UpdateFunPrice(), DisplaySEMessage("s", e.msg);
                var t = $("#fun_buy_lock_time_dropdown").val(),
                    a = parseInt($("#buy_fun_count").val());
                15 != t && 30 != t && 90 != t && 180 != t && 360 != t || ($("#savings_fun_to_lock").val(a), $("#fun_savings_time_dropdown").val(t), $("#save_fun_confirm").click())
            } else "error" == e.status ? (DisplaySEMessage("e", e.msg), null != e.fun_price && ($("#buy_fun_count").val(""), $("#fun_buy_price").html(parseFloat(e.fun_price).toFixed(8)), FUNPPriceLockTimer())) : DisplaySEMessage("e", "Unexpected Error! please reload the page and try again.");
            $("#buy_fun_confirm").attr("disabled", !1)
        }))
    })), $("#sell_fun_confirm").click((function(e) {
        $("#sell_fun_confirm").attr("disabled", !0), $.post("/cgi-bin/api.pl", {
            op: "trade_fun",
            fun_price: parseFloat($("#fun_sell_price").html()).toFixed(8),
            buy_qty: parseInt($("#buy_fun_count").val()),
            type: "sell"
        }).done((function(e) {
            "success" == e.status ? ($("#balance").html(parseFloat(e.balance / 1e8).toFixed(8)), balanceChanged(), UpdateFunPrice(), DisplaySEMessage("s", e.msg)) : "error" == e.status ? (DisplaySEMessage("e", e.msg), null != e.fun_price && ($("#buy_fun_count").val(""), $("#fun_sell_price").html(parseFloat(e.fun_price).toFixed(8)), FUNPPriceLockTimer())) : DisplaySEMessage("e", "Unexpected Error! please reload the page and try again."), $("#sell_fun_confirm").attr("disabled", !1)
        }))
    })), $("#save_fun_confirm").click((function(e) {
        $("#save_fun_confirm").attr("disabled", !0), $.post("/cgi-bin/api.pl", {
            op: "fun_savings",
            fun_amount: parseInt($("#savings_fun_to_lock").val()),
            period: parseInt($("#fun_savings_time_dropdown").val())
        }).done((function(e) {
            "success" == e.status ? DisplaySEMessage("s", e.msg) : "error" == e.status ? DisplaySEMessage("e", e.msg) : DisplaySEMessage("e", "Unexpected Error! please reload the page and try again."), $("#save_fun_confirm").attr("disabled", !1)
        }))
    }));
    var p = [2500, 5e3, 12500, 5e4, 125e3, 25e4, 5e5];
    p.indexOf(0), $(".js-range-slider").ionRangeSlider({
        grid: !0,
        skin: "big",
        hide_min_max: !0,
        values: p,
        prettify_separator: ",",
        my_from: 0,
        onChange: function(e) {
            BenefitsSliderChange(e.from_value)
        }
    }), BenefitsSliderChange(2500), $("#exchange_bcc_button").click((function(e) {
        $("#exchange_bcc_button").attr("disabled", !0), $.post("/", {
            op: "exchange_bcc"
        }).done((function(e) {
            var t = e.split(":");
            "s" == t[0] && ($("#balance").html(t[2]), balanceChanged(), $("#exchange_bcc_link").hide()), DisplaySEMessage(t[0], t[1]), $("#exchange_bcc_button").attr("disabled", !1)
        }))
    })), $("#main_deposit_address_qr_code_link").click((function() {
        $("#main_deposit_address_qr_code").show()
    })), $(".logout_link").click((function(e) {
        $.cookie.raw = !0, $.removeCookie("btc_address"), $.removeCookie("password"), $.get("/cgi-bin/api.pl?op=logout", (function(e) {
            $.removeCookie("fbtc_session"), $.removeCookie("fbtc_userid")
        })), window.location.replace("https://freebitco.in/")
    })), $("#hide_enable_2fa_msg_alert").click((function() {
        $("#enable_2fa_msg_alert").hide(), $.cookie.raw = !0, $.cookie("hide_enable_2fa_msg_alert", 1, {
            expires: 7,
            secure: !0,
            path: "/"
        })
    })), $("#hide_earn_btc_msg").click((function() {
        $("#earn_btc_msg").hide(), $.cookie.raw = !0, $.cookie("hide_earn_btc_msg", 1, {
            expires: 3650,
            secure: !0,
            path: "/"
        })
    })), $("#double_your_btc_tab").on("keydown", "#double_your_btc_stake", (function(e) {
        var t = e.keyCode || e.which;
        72 == t ? (e.preventDefault(), $("#double_your_btc_bet_hi_button").is(":enabled") && $("#double_your_btc_bet_hi_button").click()) : 76 == t ? (e.preventDefault(), $("#double_your_btc_bet_lo_button").is(":enabled") && $("#double_your_btc_bet_lo_button").click()) : 65 == t ? (e.preventDefault(), $("#double_your_btc_stake").val() > 1e-8 && $("#double_your_btc_half").click()) : 83 == t ? (e.preventDefault(), $("#double_your_btc_2x").click()) : 68 == t ? (e.preventDefault(), $("#double_your_btc_min").click()) : 70 == t ? (e.preventDefault(), $("#double_your_btc_max").click()) : 81 == t ? (e.preventDefault(), $("#double_your_btc_payout_multiplier").val(parseFloat($("#double_your_btc_payout_multiplier").val()) + 1), $("#double_your_btc_payout_multiplier").keyup()) : 87 == t ? (e.preventDefault(), $("#double_your_btc_payout_multiplier").val(parseFloat($("#double_your_btc_payout_multiplier").val()) - 1), $("#double_your_btc_payout_multiplier").keyup()) : 69 == t ? (e.preventDefault(), $("#double_your_btc_payout_multiplier").val(parseFloat($("#double_your_btc_payout_multiplier").val()) + 5), $("#double_your_btc_payout_multiplier").keyup()) : 82 == t ? (e.preventDefault(), $("#double_your_btc_payout_multiplier").val(parseFloat($("#double_your_btc_payout_multiplier").val()) - 5), $("#double_your_btc_payout_multiplier").keyup()) : 84 == t ? (e.preventDefault(), $("#double_your_btc_payout_multiplier").val(parseFloat($("#double_your_btc_payout_multiplier").val()) + 10), $("#double_your_btc_payout_multiplier").keyup()) : 89 == t && (e.preventDefault(), $("#double_your_btc_payout_multiplier").val(parseFloat($("#double_your_btc_payout_multiplier").val()) - 10), $("#double_your_btc_payout_multiplier").keyup())
    })), $("#lottery_tickets_purchase_count").keyup((function(e) {
        var t = parseInt($("#lottery_tickets_purchase_count").val()),
            a = parseFloat($(".lottery_ticket_price").html()).toFixed(8);
        $("#lottery_total_purchase_price").html(parseFloat(t * a * 1e8 / 1e8).toFixed(8))
    })), $("#lottery_tickets_purchase_count").keypress((function() {
        $("#lottery_tickets_purchase_count").keyup()
    })), $("#lottery_tickets_purchase_count").keydown((function() {
        $("#lottery_tickets_purchase_count").keyup()
    })), $("#purchase_lottery_tickets_button").click((function(e) {
        $("#purchase_lottery_tickets_button").attr("disabled", !0), $.get("/?op=purchase_lott_tickets&num=" + $("#lottery_tickets_purchase_count").val(), (function(e) {
            var t = e.split(":");
            if ($("#lottery_tickets_purchase_message").html(""), $("#lottery_tickets_purchase_message").show(), $("#lottery_tickets_purchase_message").removeClass("free_play_result_error"), $("#lottery_tickets_purchase_message").removeClass("free_play_result_success"), "e" == t[0] && ($("#lottery_tickets_purchase_message").addClass("free_play_result_error"), $("#lottery_tickets_purchase_message").html(t[1])), "s" == t[0] && ($("#lottery_tickets_purchase_message").addClass("free_play_result_success"), "s1" == t[1])) {
                var a = "tickets";
                1 == parseInt(t[2]) && (a = "ticket"), $("#lottery_tickets_purchase_message").html("Successfully purchased " + t[2] + " " + a + " in lottery round " + t[5] + " for " + parseFloat(t[4] / 1e8).toFixed(8) + " BTC."), $("#user_lottery_tickets").html(ReplaceNumberWithCommas(t[3])), $("#balance").html(parseFloat(t[6] / 1e8).toFixed(8)), balanceChanged()
            }
            $("#purchase_lottery_tickets_button").attr("disabled", !1)
        }))
    }));
    var b = 0;
    $(window).scroll((function() {
        $(".fbtc_left_sky").css("top", $(this).scrollTop())
    })), $("#free_play_claim_button").click((function(e) {
        window.location.href = "https://freebitco.in/?op=home&free_play_claim=" + b
    })), $("#free_play_form_button").click((function(e) {
        e.preventDefault(), $("#free_play_digits").show(), $(".free_play_element").hide();
        var t = new Fingerprint({
                canvas: !0,
                screen_resolution: !0,
                ie_activex: !0
            }).get(),
            a = setInterval((function() {
                $("#free_play_first_digit").html(Math.floor(10 * Math.random()))
            }), 10),
            o = setInterval((function() {
                $("#free_play_second_digit").html(Math.floor(10 * Math.random()))
            }), 10),
            n = setInterval((function() {
                $("#free_play_third_digit").html(Math.floor(10 * Math.random()))
            }), 10),
            i = setInterval((function() {
                $("#free_play_fourth_digit").html(Math.floor(10 * Math.random()))
            }), 10),
            s = setInterval((function() {
                $("#free_play_fifth_digit").html(Math.floor(10 * Math.random()))
            }), 10);
        $("#free_play_form_button").attr("disabled", !0), $("html, body").animate({
            scrollTop: $("#free_play_digits").offset().top - 50
        }, "fast");
        var r = {
            op: "free_play",
            fingerprint: fingerprint,
            client_seed: $("#next_client_seed").val(),
            fingerprint2: t,
            pwc: $("#pwc_input").val()
        };
        $("#free_play_recaptcha") && $("#free_play_recaptcha").length > 0 && "undefined" != typeof hcaptcha && (r.h_recaptcha_response = encodeURIComponent(hcaptcha.getResponse())), $("#captchasnet_free_play_captcha .captchasnet_captcha_input_box").val() && $("#captchasnet_free_play_captcha .captchasnet_captcha_input_box").val().length > 0 && (r.captchasnet_random = $("#captchasnet_free_play_captcha .captchasnet_captcha_random").val(), r.captchasnet_response = $("#captchasnet_free_play_captcha .captchasnet_captcha_input_box").val()), $("#botdetect_free_play_captcha2 .captchasnet_captcha_input_box").val() && $("#botdetect_free_play_captcha2 .captchasnet_captcha_input_box").val().length > 0 && (r.botdetect_random2 = $("#botdetect_free_play_captcha2 .captchasnet_captcha_random").val(), r.botdetect_response2 = $("#botdetect_free_play_captcha2 .captchasnet_captcha_input_box").val()), $("#securimage_free_play_captcha .captchasnet_captcha_input_box").val() && $("#securimage_free_play_captcha .captchasnet_captcha_input_box").val().length > 0 && (r.securimage_random = $("#securimage_free_play_captcha .captchasnet_captcha_random").val(), r.securimage_response = $("#securimage_free_play_captcha .captchasnet_captcha_input_box").val()), $("#botdetect_free_play_captcha .captchasnet_captcha_input_box").val() && $("#botdetect_free_play_captcha .captchasnet_captcha_input_box").val().length > 0 && (r.botdetect_random = $("#botdetect_free_play_captcha .captchasnet_captcha_random").val(), r.botdetect_response = $("#botdetect_free_play_captcha .captchasnet_captcha_input_box").val()), $.post("/", r).done((function(e) {
            var t = e.split(":");
            if ($("#free_play_error").html(""), $("#free_play_error").hide(), "e" == t[0]) clearInterval(a), clearInterval(o), clearInterval(n), clearInterval(i), clearInterval(s), $("#free_play_first_digit").html(0), $("#free_play_second_digit").html(0), $("#free_play_third_digit").html(0), $("#free_play_fourth_digit").html(0), $("#free_play_fifth_digit").html(0), $(".free_play_element").show(), $("#free_play_error").show(), $("#free_play_error").html(t[1]), $("#free_play_recaptcha") && $("#free_play_recaptcha").length > 0 && "undefined" != typeof hcaptcha && hcaptcha.reset(), $("#captchasnet_free_play_captcha") && $("#captchasnet_free_play_captcha").length > 0 && GenerateCaptchasNetCaptcha("captchasnet_free_play_captcha", 0), $("#captchasnet_free_play_captcha2") && $("#captchasnet_free_play_captcha2").length > 0 && GenerateCaptchasNetCaptcha("captchasnet_free_play_captcha2", 0), $("#botdetect_free_play_captcha") && $("#botdetect_free_play_captcha").length > 0 && GenerateCaptchasNetCaptcha("botdetect_free_play_captcha", 3), $("#botdetect_free_play_captcha2") && $("#botdetect_free_play_captcha2").length > 0 && GenerateCaptchasNetCaptcha("botdetect_free_play_captcha2", 3), $("#securimage_free_play_captcha") && $("#securimage_free_play_captcha").length > 0 && GenerateCaptchasNetCaptcha("securimage_free_play_captcha", 2), "e1" == t[3] && ($("#free_play_error").hide(), $(".free_play_element").hide(), $("#wait").show(), $("#same_ip_error").show(), $("#same_ip_error").html(t[1]), $("#time_remaining").countdown({
                until: +t[2],
                format: "MS"
            }), setTimeout((function() {
                RefreshPageAfterFreePlayTimerEnds()
            }), 1e3 * parseInt(t[2])), title_countdown(parseInt(t[2])));
            else if ("s" == t[0]) {
                var r = t[1],
                    l = r.split("");
                if (r.toString().length < 5)
                    for (var _ = 5 - r.toString().length, c = 0; c < _; c++) l.unshift("0");
                clearInterval(a), clearInterval(o), clearInterval(n), clearInterval(i), clearInterval(s), $("#free_play_fifth_digit").html(l[4]), $("#free_play_fourth_digit").html(l[3]), $("#free_play_third_digit").html(l[2]), $("#free_play_second_digit").html(l[1]), $("#free_play_first_digit").html(l[0]), $.cookie.raw = !0, $.cookie("last_play", t[4], {
                    expires: 3650,
                    secure: !0,
                    path: "/"
                }), $.removeCookie("ivp7GpJPvMtG"), $(".free_play_element").hide(), $("#free_play_result").show(), $("#wait").show(), $("#balance").html(t[2]), balanceChanged(), $("#time_remaining").countdown({
                    until: 3600,
                    format: "MS"
                }), setTimeout((function() {
                    RefreshPageAfterFreePlayTimerEnds()
                }), 36e5), title_countdown(3600), b = parseFloat(Math.round(1e8 * t[3]) / 1e8).toFixed(8), $("#winnings").html(b), $("#balance_usd").html(t[5]), $("#next_server_seed_hash").val(t[6]), $("#next_nonce").html(t[8]), $(".previous_server_seed").html(t[9]), $("#previous_server_seed_hash").val(t[10]), $(".previous_client_seed").html(t[11]), $(".previous_nonce").html(t[12]), $("#previous_roll").html(t[1]), $("#no_previous_rolls_msg").hide(), $("#previous_rolls_table").show(), $("#previous_roll_strings").show(), $("#verify_rolls_link").attr("href", "https://s3.amazonaws.com/roll-verifier/verify.html?server_seed=" + t[9] + "&client_seed=" + t[11] + "&server_seed_hash=" + t[10] + "&nonce=" + t[12]), $("#user_lottery_tickets").html(ReplaceNumberWithCommas(t[13])), $(".user_reward_points").html(ReplaceNumberWithCommas(t[14])), $("#fp_lottery_tickets_won").html(t[15]), $("#fp_reward_points_won").html(t[16]), $("#fp_multiplier_bonus").html(t[17]), $("#fp_bonus_req_completed").html(t[18]), last_nonce = t[12];
                var d = "";
                if (parseInt(t[19]) > 0 && (d = d + ', <a href="https://freebitco.in/static/html/wof/wof-premium.html" target=_blank">' + t[19] + " WOF Spins</a>"), parseInt(t[20]) > 0 && (d = d + ', <a href="javascript:void(0);" onclick="SwitchPageTabs(\'loyalty_token\');">' + t[20] + " FUN Tokens</a>"), $("#fp_bonus_wins").html(d), parseInt(t[1]) > 9997) {
                    var u = 20;
                    parseInt(t[1]) > 9999 && (u = 200), $("#make_extra_5_msg").show(), $("#fp_forum_msg").html("[b]I just won $" + u + " at FreeBitco.in![/b]&#13;&#10;&#13;&#10;My user id is " + socket_userid + ".&#13;&#10;&#13;&#10;My winning seeds: https://s3.amazonaws.com/roll-verifier/verify.html?server_seed=" + t[9] + "&client_seed=" + t[11] + "&server_seed_hash=" + t[10] + "&nonce=" + t[12])
                }
                setTimeout((function() {
                    $(".show_multiply_modal").click()
                }), 2e3)
            }
            $("#free_play_form_button").attr("disabled", !1)
        }))
    })), $("#older_lottery_winners_link").click((function() {
        lottery_winners_round_display > 1 && PreviousLotteryWinners(lottery_winners_round_display - 1)
    })), $("#newer_lottery_winners_link").click((function() {
        lottery_winners_round_display < latest_lottery_round - 1 && PreviousLotteryWinners(lottery_winners_round_display + 1)
    })), $(".top-bar-section ul.right li").click((function() {
        $(".top-bar").removeClass("expanded")
    })), $("#set_email_preferences").click((function() {
        $("#set_email_preferences").attr("disabled", !0);
        var e = $(".email_subs_checkbox:checkbox:checked").map((function() {
            return this.value
        })).get().toString();
        $.get("/?op=set_email_subscriptions&subs=" + e, (function(e) {
            $("#set_email_preferences").attr("disabled", !1), DisplaySEMessage("s", "Succesfully updated email subscriptions")
        }))
    })), $("#double_your_btc_payout_multiplier").keyup((function() {
        parseFloat($("#double_your_btc_payout_multiplier").val()) < 1.01 && 1 != parseFloat($("#double_your_btc_payout_multiplier").val()) ? $("#double_your_btc_payout_multiplier").val(1.01) : parseFloat($("#double_your_btc_payout_multiplier").val()) > 4750 && $("#double_your_btc_payout_multiplier").val(4750), CalculateWinAmount(), $("#double_your_btc_win_chance").val(parseFloat(parseInt($(".lt").html()) / 1e4 * 100).toFixed(2) + "%")
    })), $("#double_your_btc_win_chance").keyup((function() {
        parseFloat($("#double_your_btc_win_chance").val()) > 94.06 ? $("#double_your_btc_win_chance").val("94.06%") : parseFloat($("#double_your_btc_win_chance").val()) < .02 && 0 != parseFloat($("#double_your_btc_win_chance").val()) && $("#double_your_btc_win_chance").val("0.02%"), $("#double_your_btc_payout_multiplier").val(parseFloat(95 / parseFloat($("#double_your_btc_win_chance").val())).toFixed(2)), CalculateWinAmount()
    })), $("#double_your_btc_payout_multiplier").change((function() {
        $("#double_your_btc_payout_multiplier").val(parseFloat(9500 / parseInt($(".lt").html())).toFixed(2))
    })), $("#double_your_btc_win_chance").change((function() {
        $("#double_your_btc_win_chance").val(parseFloat(parseInt($(".lt").html()) / 1e4 * 100).toFixed(2) + "%")
    })), $("#double_your_btc_win_chance").focus((function() {
        $("#win_chance_value_message").show()
    })), $("#double_your_btc_win_chance").focusout((function() {
        $("#win_chance_value_message").hide()
    })), $("#double_your_btc_payout_multiplier").focus((function() {
        $("#payout_value_message").show()
    })), $("#double_your_btc_payout_multiplier").focusout((function() {
        $("#payout_value_message").hide()
    })), $("body").on("click", ".signup_menu_button", (function() {
        $("#login_form").hide(), $("#homepage_login_button").show(), $("#homepage_signup_button").hide(), $("#signup_form").fadeIn()
    })), $("#link_features").click((function() {
        $("html, body").animate({
            scrollTop: $("#features").offset().top - 40
        }, 800)
    })), $("#link_home, .login_menu_button, .signup_menu_button").click((function() {
        $("html, body").animate({
            scrollTop: $("#new_home").offset().top - 40
        }, 800)
    })), $("#link_bitcoin").click((function() {
        $("html, body").animate({
            scrollTop: $("#home_bitcoin").offset().top - 40
        }, 800)
    })), $("#link_news").click((function() {
        $("html, body").animate({
            scrollTop: $("#home_news").offset().top - 40
        }, 800)
    })), 1 == $.cookie("have_account") && $(".login_menu_button").click(), null == document.createElement("input").placeholder && $(".form_placeholders").show(), $("#user_ads_unselect_all_countries").click((function(e) {
        $("#user_ads_target_country_code option").prop("selected", !1)
    })), $("#ad_details_unselect_all_countries").click((function(e) {
        $("#ad_details_target_country_code option").prop("selected", !1)
    })), $(".ad_position_checkbox").click((function(e) {
        $(".ad_position_checkbox").prop("checked", !1), $(".ad_position_checkbox:checkbox[value=" + this.value + "]").prop("checked", !0)
    })), $("#autobet_bet_odds").focus((function() {
        $("#autobet_payout_value_message").show()
    })), $("#autobet_bet_odds").focusout((function() {
        $("#autobet_payout_value_message").hide()
    }));
    var m = 0;
    $("#auto_bet_on").click((function() {
        $("#double_your_btc_result").hide(), $("#double_your_btc_left_section").hide(), $("#double_your_btc_auto_bet_left_section").show(), $("#disable_animation").hide(), $("#double_your_btc_right_section").hide(), $("#double_your_btc_auto_bet_right_section").show(), $(".manual_bet_element").hide(), $(".auto_bet_element").show(), $("#double_your_btc_middle_section").css({
            height: "auto",
            "padding-bottom": "6px"
        }), $(this).addClass("betting_mode_on"), $(this).removeClass("manual_auto_bet_on_button"), $("#manual_bet_on").removeClass("betting_mode_on"), $("#manual_bet_on").addClass("manual_auto_bet_on_button"), $("#multiplier_first_digit").html("0"), $("#multiplier_second_digit").html("0"), $("#multiplier_third_digit").html("0"), $("#multiplier_fourth_digit").html("0"), $("#multiplier_fifth_digit").html("0"), $("#multiplier_enable_sound_div").hide(), m = 1
    })), $("#manual_bet_on").click((function() {
        !0 === autobet_running ? $("#auto_bet_running").show() : (1 === m && $("body").innerWidth() > 1255 && (m = 0, $("#double_your_btc_middle_section").css({
            "border-radius": "0"
        })), $("#autobet_results_box").hide(), $("#disable_animation").show(), $("#double_your_btc_result").hide(), $("#double_your_btc_auto_bet_left_section").hide(), $("#double_your_btc_left_section").show(), $("#double_your_btc_auto_bet_right_section").hide(), $("#double_your_btc_right_section").show(), $(".auto_bet_element").hide(), $(".manual_bet_element").show(), $("#double_your_btc_middle_section").css({
            height: "362.781px"
        }), $(this).addClass("betting_mode_on"), $(this).removeClass("manual_auto_bet_on_button"), $("#auto_bet_on").removeClass("betting_mode_on"), $("#auto_bet_on").addClass("manual_auto_bet_on_button"), $("#multiplier_first_digit").html("0"), $("#multiplier_second_digit").html("0"), $("#multiplier_third_digit").html("0"), $("#multiplier_fourth_digit").html("0"), $("#multiplier_fifth_digit").html("0"), $("#multiplier_enable_sound_div").show(), $("#autobet_error").hide())
    })), $("#close_auto_bet_running_message").click((function() {
        $("#auto_bet_running").hide()
    })), $("#show_double_your_btc_auto_bet_on_lose").click((function() {
        $(this).addClass("multiplier_header_background"), $("#show_double_your_btc_auto_bet_on_win").removeClass("multiplier_header_background"), $("#double_your_btc_auto_bet_on_win").hide(), $("#double_your_btc_auto_bet_on_lose").show()
    })), $("#show_double_your_btc_auto_bet_on_win").click((function() {
        $(this).addClass("multiplier_header_background"), $("#show_double_your_btc_auto_bet_on_lose").removeClass("multiplier_header_background"), $("#double_your_btc_auto_bet_on_lose").hide(), $("#double_your_btc_auto_bet_on_win").show()
    })), $("#manual_bet_on").click(), $("#home_news").find(".news_content:first").show(), $("#news_tab").find(".inside_news_content:first").show(), $("#newer_bet_history").click((function() {
        --bet_history_page < 0 && (bet_history_page = 0), GetBetHistory(bet_history_page, last_nonce)
    })), $("#older_bet_history").click((function() {
        ++bet_history_page < 0 && (bet_history_page = 0), GetBetHistory(bet_history_page, last_nonce)
    })), $("#show_roll_history_mobile").click((function() {
        $("#bet_history_table").toggle()
    })), $("#signup_page_captcha_types").change((function() {
        $(".signup_page_captcha").hide(), $("#" + $("#signup_page_captcha_types").val() + "_captcha").show()
    })), $(".reward_point_redeem_result_box_close").click((function() {
        $("#reward_point_redeem_result_container_div").hide()
    })), $("#encash_points_number").keyup((function(e) {
        var t = parseInt($("#encash_points_number").val()),
            a = parseFloat($(".lottery_ticket_price").html()).toFixed(8);
        $("#reward_points_redeem_price").html(parseFloat(t * a * 1e8 / 1e8).toFixed(8))
    })), $("#encash_points_number").keypress((function() {
        $("#encash_points_number").keyup()
    })), $("#encash_points_number").keydown((function() {
        $("#encash_points_number").keyup()
    })), $("#rp_wof_tix_no").keyup((function(e) {
        $("#rp_wof_tix_total_rp").html(parseInt($("#rp_wof_tix_no").val() * rp_wof_price))
    })), $("#rp_wof_tix_no").keypress((function() {
        $("#rp_wof_tix_no").keyup()
    })), $("#rp_wof_tix_no").keydown((function() {
        $("#rp_wof_tix_no").keyup()
    })), $(".reward_category_name").click((function() {
        $(this).find(".toggle_down_up").prop("className").split(" ").indexOf("fa-arrow-down") > -1 ? ($(this).find(".toggle_down_up").remove(), $(this).append('<i class="toggle_down_up fa fa-arrow-up" style="float:right; color: #fff;" aria-hidden="true"></i>')) : $(this).find(".toggle_down_up").prop("className").split(" ").indexOf("fa-arrow-up") > -1 && ($(this).find(".toggle_down_up").remove(), $(this).append('<i class="toggle_down_up fa fa-arrow-down" style="float:right; color: #fff;" aria-hidden="true"></i>')), $(this).next(".reward_category_details").slideToggle("200"), $(this).next(".profile_change_box").slideToggle("200")
    })), $("#disable_lottery_checkbox").click((function() {
        var e = 0;
        $("#disable_lottery_checkbox").is(":checked") && (e = 1), $.get("/?op=toggle_lottery&value=" + e, (function(e) {
            var t = e.split(":");
            DisplaySEMessage(t[0], t[1])
        }))
    })), $("#disable_interest_checkbox").click((function() {
        var e = 0;
        $("#disable_interest_checkbox").is(":checked") && (e = 1), $.get("/?op=toggle_interest&value=" + e, (function(e) {
            var t = e.split(":");
            DisplaySEMessage(t[0], t[1])
        }))
    })), $("#enable_2fa_0").click((function() {
        $.get("/?op=confirm_email", (function(e) {
            var t = e.split(":"),
                a = 0;
            "s2" == t[2] && ($("#enable_2fa_0").parent("div").hide(), $("#enable_2fa_2").parent("div").show()), "s" == t[0] && (a = 3e4), DisplaySEMessage(t[0], t[1], a)
        }))
    })), $("#enable_2fa_2").click((function() {
        $.get("/?op=enable_2fa&func=show", (function(e) {
            var t = e.split(":");
            if ("s" == t[0]) {
                $("#enable_2fa_2").parent("div").hide(), $("#show_2fa_secret").show();
                var a = "otpauth://totp/" + t[2] + "?secret=" + t[3];
                $("#2fa_secret").html("<p id='tfa_secret_qr_code'></p><p style='height: 45px; margin-right: auto; margin-left: auto; width: 300px; border-radius: 3px;'><span class='secret_key_background left'>Secret Key </span><span class='left bold' style='width: 180px; padding: 10px; border: 1px solid #ccc; border-left: none; border-radius: 0 3px 3px 0;'>" + t[3] + "</span></p>"), $("#tfa_secret_qr_code").qrcode({
                    width: 200,
                    height: 200,
                    text: a
                })
            } else DisplaySEMessage(t[0], t[1])
        }))
    }));
    var h = getParameterByName("fun_binance_contest_popup");
    void 0 !== h && "1" == h && (SwitchPageTabs("loyalty_token"), $("#fun_binance_contest_link").click());
    var f = getParameterByName("buy_fun_popup");
    if (void 0 !== f) {
        "1" == f && (SwitchPageTabs("loyalty_token"), UpdateFunPrice(), $("#buy_fun_modal").foundation("reveal", "open"));
        var g = getParameterByName("fun_amt");
        g > 0 && ($("#buy_fun_count").val(g), RecalculateFUNBenefitsBuyBox())
    }
    var y = getParameterByName("fun_savings_popup");
    if (void 0 !== y && "1" == y && (SwitchPageTabs("loyalty_token"), $("#fun_savings_modal").foundation("reveal", "open")), $("#buy_fun_count").on("input", (function() {
            RecalculateFUNBenefitsBuyBox()
        })), $("#savings_fun_to_lock").on("input", (function() {
            RecalculateFUNSavingsMaturity()
        })), $("#activate_2fa").click((function() {
            $.post("/", {
                op: "enable_2fa",
                func: "enable",
                code: $("#activate_2fa_code").val(),
                phone: $("#tfa_recovery_phone").val()
            }).done((function(e) {
                var t = e.split(":");
                DisplaySEMessage(t[0], t[1]), "s" == t[0] && ($("#activate_2fa").parent("div").hide(), $("#disable_2fa").parent("div").show(), $(".profile_2fa_field").show(), $("html, body").animate({
                    scrollTop: $("#2fa_profile_box").offset().top - 45
                }, "fast"), $("#enable_2fa_msg_alert").hide())
            }))
        })), $("#disable_2fa").click((function() {
            $.post("/", {
                op: "enable_2fa",
                func: "disable",
                code: $("#disable_2fa_code").val()
            }).done((function(e) {
                var t = e.split(":");
                DisplaySEMessage(t[0], t[1]), "s" == t[0] && ($("#enable_2fa_0").parent("div").show(), $(".profile_2fa_field").hide(), $("#disable_2fa").parent("div").hide())
            }))
        })), $("#submit_2fa_recovery_details").click((function() {
            $.post("/", {
                op: "change_2fa_phone",
                code: $("#rp_tfa_code").val(),
                phone: $("#rp_phone_number").val()
            }).done((function(e) {
                var t = e.split(":");
                DisplaySEMessage(t[0], t[1])
            }))
        })), $(".tfa_enter_recovery_phone_link").click((function() {
            SwitchPageTabs("edit"), $("html, body").animate({
                scrollTop: $("#2fa_recovery_phone_box").offset().top - 45
            }, "fast"), $("#2fa_recovery_phone_box").click()
        })), $("#share_button").click((function() {
            var e = $("#share_amount").val();
            if (1 == confirm("If you click OK, then " + e + " BTC will be deducted from your account and distributed among your referrals. If you do not wish to do this, please click CANCEL")) {
                $("#share_button").attr("disabled", !0);
                var t = 0;
                $("#equal_share").is(":checked") && (t = 1), $("#weighted_share").is(":checked") && (t = 2), $("#last_payout_share").is(":checked") && (t = 3), $.get("/?op=share_coins&method=" + t + "&amount=" + e, (function(e) {
                    var t = e.split(":");
                    if ("e" == t[0]) DisplaySEMessage(t[0], t[1]);
                    else if ("s" == t[0]) {
                        var a = parseFloat(parseInt(t[2]) / 1e8).toFixed(8);
                        $("#balance").html(parseFloat(parseInt(t[1]) / 1e8).toFixed(8)), balanceChanged(), $("#share_given").html(t[4]), $("#recent_share_given").html(t[5]), DisplaySEMessage(t[0], a + " BTC shared with " + t[3] + " referrals")
                    }
                    $("#share_button").attr("disabled", !1)
                }))
            }
        })), $("#claim_bonus_button").click((function() {
            $("#accept_bonus_terms").is(":checked") ? $.get("/?op=credit_deposit_bonus&amount=" + $("#claim_bonus_amount").val(), (function(e) {
                var t = e.split(":");
                "e" == t[0] ? DisplaySEMessage(t[0], t[1]) : "s" == t[0] && ($("#bonus_account_table").show(), $("#user_claimed_deposit_bonus").show(), $("#bonus_account_balance").html(t[1] + " BTC"), $("#bonus_account_wager").html(t[2] + " BTC"), $("#balance").html(t[3]), balanceChanged(), $("#bonus_eligible_msg").hide(), DisplaySEMessage(t[0], t[4]), $("#myModal24").foundation("reveal", "close"), bonus_table_closed = 0)
            })) : DisplaySEMessage("e", "Please read and agree to the terms below")
        })), $("#earn_btc_acc_balance").keyup((function(e) {
            var t = parseInt(1e8 * $("#earn_btc_acc_balance").val());
            t > 29e3 ? ($("#earn_btc_daily_interest").html(parseFloat(Math.floor(t * daily_interest_rate / 100) / 1e8).toFixed(8)), $("#earn_btc_monthly_interest").html(parseFloat(Math.floor(t * daily_interest_rate * 30.04 / 100) / 1e8).toFixed(8)), $("#earn_btc_yearly_interest").html(parseFloat(Math.floor(t * daily_interest_rate * 372.34 / 100) / 1e8).toFixed(8))) : ($("#earn_btc_daily_interest").html("0"), $("#earn_btc_monthly_interest").html("0"), $("#earn_btc_yearly_interest").html("0"))
        })), $("#earn_btc_acc_balance").keypress((function() {
            $("#earn_btc_acc_balance").keyup()
        })), $("#earn_btc_acc_balance").keydown((function() {
            $("#earn_btc_acc_balance").keyup()
        })), $("#earn_btc_acc_balance").val($("#balance").html()), $("#earn_btc_acc_balance").keyup(), $("#hide_pending_payouts_table").click((function() {
            hide_pending_payments = 1, $("#pending_payouts_table_new").hide()
        })), $("#hide_pending_deposits_table").click((function() {
            hide_pending_deposits = 1, $("#unconfirmed_deposits_table").hide()
        })), $("#claim_bonus_link").click((function() {
            max_deposit_bonus > parseFloat(min_bonus_amount) && ($(".dep_bonus_max").html(max_deposit_bonus + " BTC"), max_deposit_bonus > parseFloat($("#balance").html()) ? $(".dep_bonus_max").val($("#balance").html()) : $(".dep_bonus_max").val(max_deposit_bonus)), $("#balance2").html($("#balance").html())
        })), $("#bet_history_table_rows").on("click", ".show_balance_before_after", (function() {
            $(this).toggleClass("fa-arrows-alt fa-arrow-up"), $(this).parents(".multiply_bet_history_table_row").children(".balance_before_after").toggle()
        })), 1 != $.cookie("hide_no_apps_msg") && $("#no_apps_msg").show(), $("#hide_no_apps_msg").click((function() {
            $("#no_apps_msg").hide(), $.cookie.raw = !0, $.cookie("hide_no_apps_msg", 1, {
                expires: 3650,
                secure: !0,
                path: "/"
            })
        })), 1 != $.cookie("hide_mine_btc_msg") && $("#mine_btc_msg").show(), $("#exchange_btg_button").click((function(e) {
            $("#exchange_btg_button").attr("disabled", !0), $.post("/", {
                op: "exchange_btg"
            }).done((function(e) {
                var t = e.split(":");
                "s" == t[0] && ($("#balance").html(t[2]), balanceChanged(), $("#exchange_btg_link").hide()), DisplaySEMessage(t[0], t[1]), $("#exchange_btg_button").attr("disabled", !1)
            }))
        })), $("body").innerWidth() < 763 ? ($("#deposit_withdraw_container").addClass("deposit_withdraw_container_mobile"), $("#deposit_withdraw_container").removeClass("deposit_withdraw_container"), $("#add_lottery_table_mobile_style").addClass("lottery_table_mobile_style"), $("#captchasnet_captcha_info_span_mobile").addClass("captchasnet_captcha_info_span_mobile"), $(".reward_table_box_left_size_change").addClass("reward_table_box_left_mobile"), $(".reward_table_box_left_size_change").removeClass("reward_table_box_left"), $(".reward_table_box_right_size_change").addClass("reward_table_box_right_mobile"), $(".reward_table_box_right_size_change").removeClass("reward_table_box_right"), $("#reward_table_box_left_size_change").addClass("border_bottom_none"), $("#hide_show_roll_history_mobile").show(), $("#bet_history_table").hide(), $("#lottery_first_amount").addClass("br_0_5"), $("lottery_second_third_div").removeClass("br_5_5"), $("lottery_second_container_div").removeClass("br_right_1px"), $("lottery_second_div").removeClass("br_5")) : ($("#deposit_withdraw_container").addClass("deposit_withdraw_container"), $("#deposit_withdraw_container").removeClass("deposit_withdraw_container_mobile"), $("#add_lottery_table_mobile_style").removeClass("lottery_table_mobile_style"), $("#captchasnet_captcha_info_span_mobile").removeClass("captchasnet_captcha_info_span_mobile"), $(".reward_table_box_left_size_change").addClass("reward_table_box_left"), $(".reward_table_box_left_size_change").removeClass("reward_table_box_left_mobile"), $(".reward_table_box_right_size_change").addClass("reward_table_box_right"), $(".reward_table_box_right_size_change").removeClass("reward_table_box_right_mobile"), $("#reward_table_box_left_size_change").removeClass("border_bottom_none"), $("#hide_show_roll_history_mobile").hide(), $("#bet_history_table").show(), $("#lottery_first_amount").removeClass("br_0_5"), $("lottery_second_third_div").addClass("br_5_5"), $("lottery_second_container_div").removeClass("br_right_1px"), $("lottery_second_div").removeClass("br_5")), $("#play_without_captchas_button").click((function() {
            $("#free_play_captcha_container").hide(), $("#play_without_captchas_button").hide(), $("#play_with_captcha_button").show(), $("#play_without_captcha_desc").show(), $("#pwc_input").val("1")
        })), $("#play_with_captcha_button").click((function() {
            $("#free_play_captcha_container").show(), $("#play_without_captchas_button").show(), $("#play_with_captcha_button").hide(), $("#play_without_captcha_desc").hide(), $("#pwc_input").val("0")
        })), $("#older_wagering_contest_winners_link").click((function() {
            wagering_contest_winners_round_display > 1 && PreviousContestWinners(wagering_contest_winners_round_display - 1)
        })), $("#newer_wagering_contest_winners_link").click((function() {
            wagering_contest_winners_round_display < current_contest_round - 1 && PreviousContestWinners(wagering_contest_winners_round_display + 1)
        })), $(".play_jackpot").prop("checked", !1), $(".autobet_play_jackpot").prop("checked", !1), $(".low_balance_buy_btc").click((function() {
            $("#main_deposit_button_top").click()
        })), $(".low_balance_deposit_btc").click((function() {
            $("#main_deposit_button_top").click()
        })), $("#buy_bitcoins_button").click((function() {})), $(".pushpad_allow_button").on("click", (function() {
            $("#push_notification_modal").foundation("reveal", "close"), pushpad("subscribe", (function(e) {
                e ? $.cookie("hide_push_msg", 1, {
                    expires: 2,
                    secure: !0,
                    path: "/"
                }) : alert("You have blocked the notifications from browser preferences: please update your browser preferences or click the lock near the address bar to change your notification preferences and then try again.")
            }))
        })), $(".pushpad_deny_button").on("click", (function() {
            $("#push_notification_modal").foundation("reveal", "close"), $.cookie("hide_push_msg", 1, {
                expires: 2,
                secure: !0,
                path: "/"
            })
        })), $("#multiply_now_div").click((function() {})), $("#guest_user_wthdraw_button").click((function(e) {
            DisplaySEMessage("e", "You need to enter an email address and verify it before you can withdraw"), SwitchPageTabs("edit"), $("html, body").animate({
                scrollTop: $("#change_email_address_box").offset().top - 45
            }, "fast"), $("#change_email_address_box").click()
        })), $("#parimutuel_back_to_all_events_button").click((function() {
            $("#parimutuel_back_to_all_events_button_div").hide(), $("#parimutuel_main_page_div").show(), $("#parimutuel_game_container_page").hide(), $("#parimutuel_page_main_text").show()
        })), $("#purchase_golden_lottery_tickets_button").click((function() {
            var e = parseInt($("#golden_lottery_tickets_purchase_count").val());
            $.get("/cgi-bin/api.pl?op=purchase_lambo_lott_tickets&num=" + e, (function(e) {
                DisplaySEMessage(e.status, e.msg), "s" == e.status && ($("#balance").html(parseFloat(e.balance / 1e8).toFixed(8)), balanceChanged(), $("#user_golden_lottery_tickets").html(ReplaceNumberWithCommas(e.user_tickets)))
            }))
        })), $("#golden_lottery_tickets_purchase_count").keyup((function(e) {
            var t = parseInt($("#golden_lottery_tickets_purchase_count").val());
            $("#golden_lottery_total_purchase_price").html(parseFloat(25e-5 * t * 1e8 / 1e8).toFixed(8))
        })), $("#golden_lottery_tickets_purchase_count").keypress((function() {
            $("#golden_lottery_tickets_purchase_count").keyup()
        })), $("#golden_lottery_tickets_purchase_count").keydown((function() {
            $("#golden_lottery_tickets_purchase_count").keyup()
        })), 11 == captcha_type) {
        var w = $.cookie("default_captcha");
        "recaptcha" !== w && "double_captchas" !== w || SwitchCaptchas(w)
    }
    if ($("body").innerWidth() < 768 ? ($.cookie.raw = !0, $.cookie("mobile", 1, {
            expires: 3650,
            secure: !0,
            path: "/"
        }), mobile_device < 1 && userid > 0 && window.location.reload()) : ($.cookie.raw = !0, $.removeCookie("mobile")), userid > 0) {
        var v = getParameterByName("tab");
        void 0 !== v && ($("#" + v + "_link").click(), $("." + v + "_link").click(), void 0 !== v && "deposit_btc" == v && $("#main_deposit_button_top").click(), void 0 !== v && "fun_savings" == v && SwitchPageTabs("fun_savings"));
        var k = getParameterByName("tab2");
        void 0 !== k && "" != k && 0 != k && "enable_2fa" == k && $("#enable_2fa_msg").click(), free_play < 1 && multi_acct_same_ip > 0 && $("#multi_acct_same_ip").show(), $("#mob_ver_country_code").find("#" + country + "_dcode").attr("selected", !0), 1 == show_sky && $("body").innerWidth() < 1201 && $("#free_play_tab").css({
            "margin-left": "50px"
        }), 0 != rp_promo_active && (parseInt(rp_promo_start) > 0 ? rp_promo_active = 2 : parseInt(rp_promo_end) > 0 ? rp_promo_active = 1 : rp_promo_active = 0, 2 == rp_promo_active ? ($("#rp_promo_" + rp_promo_counter + "_" + rp_promo_active2 + "_text").html("<b>" + rp_multiplier + "x reward points (RP) promotion starts in <span id='bonus_span_rp_promo_" + rp_promo_counter + "_" + rp_promo_active2 + "'></span></b> (" + free_rp + " RP/free roll, " + ref_rp + " RP/referral free roll, " + multiply_rp + " RP/multiply roll).<BR>Follow us on <b><a href='https://twitter.com/freebitco' target=_blank>twitter</a></b> to be notified before the promotion starts!"), BonusEndCountdown("rp_promo_" + rp_promo_counter + "_" + rp_promo_active2, parseInt(rp_promo_start))) : 1 == rp_promo_active && ($("#rp_promo_" + rp_promo_counter + "_" + rp_promo_active2 + "_text").html("<b>" + rp_multiplier + "x reward points (RP) promotion currently running and ends in <span id='bonus_span_rp_promo_" + rp_promo_counter + "_" + rp_promo_active2 + "'></span></b> (" + free_rp + " RP/free roll, " + ref_rp + " RP/referral free roll, " + multiply_rp + " RP/multiply roll).<BR>Follow us on <b><a href='https://twitter.com/freebitco' target=_blank>twitter</a></b> to be notified in advance about our future promotions!"), $(".multiply_rp_amount").html(multiply_rp), $(".free_rp_amount").html(free_rp), $(".ref_rp_amount").html(ref_rp), BonusEndCountdown("rp_promo_" + rp_promo_counter + "_" + rp_promo_active2, parseInt(rp_promo_end)), $("#bonus_weekend_msg_div").show(), $("#bonus_weekend_rp_multiplier").html(rp_multiplier)), 1 != $.cookie("rp_promo_" + rp_promo_counter + "_" + rp_promo_active2) && $("#rp_promo_" + rp_promo_counter + "_" + rp_promo_active2).show(), $("#hide_rp_promo_" + rp_promo_counter + "_" + rp_promo_active2).click((function() {
            $("#rp_promo_" + rp_promo_counter + "_" + rp_promo_active2).hide(), $.cookie.raw = !0, $.cookie("rp_promo_" + rp_promo_counter + "_" + rp_promo_active2, 1, {
                expires: 3,
                secure: !0,
                path: "/"
            })
        }))), 1 == dep_bonus_eligible ? ($(".dep_bonus_max").html(max_deposit_bonus + " BTC"), $("#bonus_eligible_msg").show()) : 2 == dep_bonus_eligible && $("#bonus_not_eligible_msg").show(), 1 == auto_withdraw ? ($("#earn_btc_msg").show(), $("#hide_earn_btc_msg").hide()) : 0 == auto_withdraw && 1 != $.cookie("hide_earn_btc_msg") && $("#earn_btc_msg").show(), (bonus_locked_balance > 0 || bonus_wagering_remaining > 0) && ($("#bonus_account_table").show(), $("#user_claimed_deposit_bonus").show(), $("#bonus_account_balance").html(bonus_locked_balance + " BTC"), $("#bonus_account_wager").html(bonus_wagering_remaining + " BTC")), 1 == show_2fa_msg && 1 != $.cookie("hide_enable_2fa_msg_alert") && $("#enable_2fa_msg_alert").show(), ScreeSizeCSSChanges(), $(window).resize(ScreeSizeCSSChanges), $("#withdraw_delay_message4").hide(), 1 == mobile_device && $("#show_referrals_mobile").click((function() {
            $("#referral_list_table").show(), $("#show_more_refs_options").show(), $("#show_referrals_mobile").html("YOUR REFERRALS")
        })), $(".hide_menu").click((function() {
            $("#menu_drop").click()
        })), $("#menu_drop").click((function() {
            $(".top-bar-section").hide()
        }))
    }
}));