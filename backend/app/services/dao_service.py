# app/services/dao_service.py

from app.services.web3_utils import get_contract, build_signed_tx, send_signed_transaction
from app import config

DAO_ADDRESS = config.DAO_ADDRESS
dao_contract = get_contract(DAO_ADDRESS, "DAO")


def create_proposal(description: str, duration: int):
    try:
        fn = dao_contract.functions.createProposal(description, duration)
        signed = build_signed_tx(fn)
        receipt = send_signed_transaction(signed)
        return {"txHash": receipt.transactionHash.hex(), "status": receipt.status}
    except Exception as e:
        raise e


def vote(proposal_id: int, support: bool):
    try:
        fn = dao_contract.functions.vote(proposal_id, support)
        signed = build_signed_tx(fn)
        receipt = send_signed_transaction(signed)
        return {"txHash": receipt.transactionHash.hex(), "status": receipt.status}
    except Exception as e:
        raise e


def execute_proposal(proposal_id: int):
    try:
        fn = dao_contract.functions.executeProposal(proposal_id)
        signed = build_signed_tx(fn)
        receipt = send_signed_transaction(signed)
        return {"txHash": receipt.transactionHash.hex(), "status": receipt.status}
    except Exception as e:
        raise e


def get_proposal(proposal_id: int):
    try:
        p = dao_contract.functions.getProposal(proposal_id).call()
        return {
            "id": p[0],
            "proposer": p[1],
            "description": p[2],
            "startTime": p[3],
            "endTime": p[4],
            "yesVotes": p[5],
            "noVotes": p[6],
            "executed": p[7],
        }
    except Exception as e:
        raise e


def get_user_proposals(user_address: str):
    try:
        proposals = dao_contract.functions.getUserProposals(user_address).call()
        result = []
        for p in proposals:
            result.append({
                "id": p[0],
                "proposer": p[1],
                "description": p[2],
                "startTime": p[3],
                "endTime": p[4],
                "yesVotes": p[5],
                "noVotes": p[6],
                "executed": p[7],
            })
        return result
    except Exception as e:
        raise e


def get_live_proposals_excluding(user_address: str):
    try:
        proposals = dao_contract.functions.getOngoingProposalsExcluding(user_address).call()
        result = []
        for p in proposals:
            result.append({
                "id": p[0],
                "proposer": p[1],
                "description": p[2],
                "startTime": p[3],
                "endTime": p[4],
                "yesVotes": p[5],
                "noVotes": p[6],
                "executed": p[7],
            })
        return result
    except Exception as e:
        raise e
