deployer := "0x4519d570f9bee8adbe0d84ec536ed325f4ba3dd6"

# send to deployer account

fund-deployer:
	yarn run send --from 0 --amount 0.5 --to ${deployer}

balance-deployer:
	yarn run balance ${deployer}

publish:
	yarn publish-contracts
