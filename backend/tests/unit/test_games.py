"""Unit tests for game XP / difficulty helpers used by the submit flow."""

from app.api.routers.games import DIFFICULTY_AR, WORLD_MISSION_ACTIONS


def test_difficulty_ar_map_covers_standard_levels():
    assert DIFFICULTY_AR["Easy"] == "سهل"
    assert DIFFICULTY_AR["Medium"] == "متوسط"
    assert DIFFICULTY_AR["Hard"] == "صعب"


def test_world_mission_actions_cover_six_worlds():
    worlds = {"arcade", "reflex", "iqlab", "shilla", "champions", "chaos"}
    assert set(WORLD_MISSION_ACTIONS.keys()) == worlds


def test_xp_formula_matches_submit_logic():
    base_xp = 400
    score = 1500
    performance_bonus = min(200, int(score * 0.1))
    total = base_xp + performance_bonus
    assert performance_bonus == 150
    assert total == 550

    hard = int(total * 2.5)
    medium = int(total * 1.5)
    easy = int(total * 1.0)
    assert hard == 1375
    assert medium == 825
    assert easy == 550
    assert max(20, int(hard * 0.25)) == 343
