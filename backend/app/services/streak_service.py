# backend/app/services/streak_service.py

from app.services.web3_utils import get_contract, build_signed_tx, send_signed_transaction
from app import config

STREAK_ADDRESS = config.STREAK_ADDRESS
streak_contract = get_contract(STREAK_ADDRESS, "Streak")

def update_streak_for_user(user_address: str):
    """
    Calls Streak.updateStreak(user).
    This should be triggered only after productive actions.
    """
    try:
        fn = streak_contract.functions.updateStreak(user_address)
        signed = build_signed_tx(fn)
        receipt = send_signed_transaction(signed)
        return {
            "txHash": receipt.transactionHash.hex(),
            "status": receipt.status
        }
    except Exception as e:
        raise Exception(f"Error updating streak: {str(e)}")


def get_streak(user_address: str):
    """
    Calls Streak.getStreak(user)
    """
    try:
        result = streak_contract.functions.getStreak(user_address).call()
        return result
    except Exception as e:
        raise Exception(f"Error fetching streak: {str(e)}")
